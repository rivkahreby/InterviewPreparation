import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import { MOCK_QUESTIONS, MOCK_MCQ_QUESTIONS } from './src/data/mockData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '1mb' }));

  // Initialize Gemini AI if key is present
  const apiKey = process.env.GEMINI_API_KEY;
  let ai: GoogleGenAI | null = null;
  if (apiKey) {
    try {
      ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
      console.log('Gemini AI Engine Initialized Server-Side.');
    } catch (err) {
      console.warn('Failed to initialize Gemini AI client:', err);
    }
  }

  // --- API ROUTES ---

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      geminiActive: !!ai,
      timestamp: new Date().toISOString(),
    });
  });

  // Generate Questions Endpoint
  app.post('/api/generate-questions', async (req, res) => {
    const { technology, difficulty, count = 5 } = req.body;

    if (!technology || !difficulty) {
      return res.status(400).json({ error: 'Technology and difficulty are required.' });
    }

    if (ai) {
      try {
        const prompt = `You are a top technical interviewer conducting a mock interview for a software engineering candidate.
Generate ${count} distinct technical interview questions for ${technology} at a ${difficulty} level.
For each question:
- State a clear, realistic technical question.
- Provide a relevant code snippet if applicable (optional).
- Specify the topic area (e.g. Memory, OOP, Async, Hooks, Data Structures).
- Provide a helpful short hint.
- Provide a concise sample model answer.

Format as a JSON array of objects with fields: id, tech, difficulty, text, codeSnippet, topic, hint, sampleAnswer.`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.6-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  tech: { type: Type.STRING },
                  difficulty: { type: Type.STRING },
                  text: { type: Type.STRING },
                  codeSnippet: { type: Type.STRING },
                  topic: { type: Type.STRING },
                  hint: { type: Type.STRING },
                  sampleAnswer: { type: Type.STRING },
                },
                required: ['id', 'text', 'topic', 'sampleAnswer'],
              },
            },
          },
        });

        const text = response.text;
        if (text) {
          const questions = JSON.parse(text);
          return res.json({ source: 'gemini', questions });
        }
      } catch (error) {
        console.error('Error generating questions with Gemini:', error);
      }
    }

    // Fallback to Mock Data
    const filteredMock = MOCK_QUESTIONS.filter(
      q => q.tech.toLowerCase() === String(technology).toLowerCase() &&
           q.difficulty.toLowerCase() === String(difficulty).toLowerCase()
    );

    // If we have enough, shuffle and slice, otherwise expand with generated variations
    let result = [...filteredMock];
    if (result.length < count) {
      // fill up with general tech questions or fallback items
      const extra = MOCK_QUESTIONS.filter(q => q.tech.toLowerCase() === String(technology).toLowerCase());
      const extraList = extra.length > 0 ? extra : MOCK_QUESTIONS;
      while (result.length < count) {
        const item = extraList[result.length % extraList.length];
        result.push({
          ...item,
          id: `${item.id}-var-${result.length}`,
          difficulty: difficulty,
        });
      }
    }

    result = result.slice(0, count);
    res.json({ source: 'mock', questions: result });
  });

  // Evaluate Answer Endpoint
  app.post('/api/evaluate-answer', async (req, res) => {
    const { questionText, userAnswer, tech, difficulty, topic } = req.body;

    if (!questionText || userAnswer === undefined) {
      return res.status(400).json({ error: 'Question text and user answer are required.' });
    }

    // Handle skipped / empty answer
    if (!userAnswer || userAnswer.trim() === '' || userAnswer.trim().toLowerCase() === '[skipped]') {
      return res.json({
        evaluation: {
          score: 0,
          scoreOutOf10: 0,
          correctPoints: [],
          missingPoints: ['Question was skipped without an attempted answer.'],
          suggestions: ['Attempt all questions, even with partial knowledge or pseudo-code.'],
          modelAnswer: 'A complete response should address core concepts with key technical terminology.',
          difficulty: difficulty || 'Beginner',
          topic: topic || 'General',
        },
      });
    }

    if (ai) {
      try {
        const prompt = `You are an expert software engineer interviewing a candidate. Evaluate the following candidate answer to a technical question.

Technology: ${tech}
Difficulty: ${difficulty}
Topic: ${topic || 'General'}
Question: "${questionText}"
Candidate's Answer: "${userAnswer}"

Evaluate strictly but constructively for a student/fresher level:
1. Assign a score out of 10 (number from 0 to 10, e.g. 8.5).
2. List 1-3 specific points the candidate answered correctly.
3. List 1-3 missing key points or technical inaccuracies.
4. Provide 1-2 practical suggestions for improvement.
5. Write a concise 2-4 sentence model answer.

Format as a single JSON object.`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.6-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                scoreOutOf10: { type: Type.NUMBER },
                correctPoints: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                missingPoints: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                suggestions: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                modelAnswer: { type: Type.STRING },
              },
              required: ['scoreOutOf10', 'correctPoints', 'missingPoints', 'suggestions', 'modelAnswer'],
            },
          },
        });

        const text = response.text;
        if (text) {
          const evalData = JSON.parse(text);
          return res.json({
            evaluation: {
              score: evalData.scoreOutOf10,
              scoreOutOf10: evalData.scoreOutOf10,
              correctPoints: evalData.correctPoints || [],
              missingPoints: evalData.missingPoints || [],
              suggestions: evalData.suggestions || [],
              modelAnswer: evalData.modelAnswer || 'Refer to documentation for detailed specs.',
              difficulty: difficulty || 'Beginner',
              topic: topic || 'General',
            },
          });
        }
      } catch (error) {
        console.error('Error evaluating answer with Gemini:', error);
      }
    }

    // Heuristic Fallback Evaluation Engine
    const wordCount = userAnswer.trim().split(/\s+/).length;
    let score = 6;
    if (wordCount > 30) score += 2;
    if (wordCount > 60) score += 1;
    if (userAnswer.includes('function') || userAnswer.includes('class') || userAnswer.includes('const') || userAnswer.includes('code') || userAnswer.includes('{')) {
      score += 1;
    }
    score = Math.min(10, Math.max(3, score));

    const evaluation = {
      score: score,
      scoreOutOf10: score,
      correctPoints: [
        'Demonstrated basic understanding of the underlying concept.',
        userAnswer.length > 40 ? 'Provided reasonable detail and context in explanation.' : 'Identified key terminology.',
      ],
      missingPoints: [
        'Could elaborate further on edge cases, memory implications, or performance trade-offs.',
        'Consider referencing specific syntax or standard framework best practices.',
      ],
      suggestions: [
        'Structure answers using the STAR method (Situation, Task, Action, Result) or Code + Explanation.',
        'Include brief code snippets to strengthen technical depth.',
      ],
      modelAnswer: `A strong answer should clearly define the core concept, explain how it operates under the hood in ${tech}, and highlight key trade-offs or practical use cases.`,
      difficulty: difficulty || 'Beginner',
      topic: topic || 'General',
    };

    res.json({ evaluation });
  });

  // MCQ Questions Endpoint
  app.get('/api/mcq-questions', (req, res) => {
    const { tech, count = 5 } = req.query;
    let list = MOCK_MCQ_QUESTIONS;
    if (tech) {
      list = list.filter(q => q.tech.toLowerCase() === String(tech).toLowerCase());
      if (list.length === 0) list = MOCK_MCQ_QUESTIONS;
    }
    const sliced = list.slice(0, Number(count));
    res.json({ questions: sliced });
  });

  // Vite Middleware in Dev vs Static Serving in Prod
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`InterviewPrep AI server listening at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
