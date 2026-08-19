import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Technology, Difficulty, MCQQuestion, MCQAttempt } from '../types';
import { ALL_TECHNOLOGIES } from '../utils/storage';
import { MOCK_MCQ_QUESTIONS } from '../data/mockData';
import { 
  BookOpen, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  RotateCcw, 
  Sparkles, 
  HelpCircle, 
  Award,
  Terminal
} from 'lucide-react';

interface MCQPracticeProps {
  onSaveAttempt: (attempt: MCQAttempt) => void;
  onBackToDashboard: () => void;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const MCQPractice: React.FC<MCQPracticeProps> = ({
  onSaveAttempt,
  onBackToDashboard,
  onShowToast,
}) => {
  const [tech, setTech] = useState<Technology>('React JS');
  const [difficulty, setDifficulty] = useState<Difficulty>('Intermediate');
  const [questions, setQuestions] = useState<MCQQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [userAnswers, setUserAnswers] = useState<{
    questionId: string;
    questionText: string;
    selectedIndex: number;
    correctIndex: number;
    isCorrect: boolean;
    explanation: string;
  }[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Load questions when tech changes
  const loadQuestions = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/mcq-questions?tech=${encodeURIComponent(tech)}&count=5`);
      const data = await res.json();
      if (data.questions && data.questions.length > 0) {
        setQuestions(data.questions);
      } else {
        const filtered = MOCK_MCQ_QUESTIONS.filter(q => q.tech === tech);
        setQuestions(filtered.length > 0 ? filtered : MOCK_MCQ_QUESTIONS);
      }
    } catch (err) {
      console.error('Error loading MCQ questions:', err);
      const filtered = MOCK_MCQ_QUESTIONS.filter(q => q.tech === tech);
      setQuestions(filtered.length > 0 ? filtered : MOCK_MCQ_QUESTIONS);
    }
    setIsLoading(false);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setUserAnswers([]);
    setIsCompleted(false);
  };

  useEffect(() => {
    loadQuestions();
  }, [tech]);

  const currentQ = questions[currentIndex];

  const handleSelectOption = (idx: number) => {
    if (isSubmitted) return;
    setSelectedOption(idx);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null || isSubmitted) return;
    setIsSubmitted(true);

    const isCorrect = selectedOption === currentQ.correctIndex;
    const answerRecord = {
      questionId: currentQ.id,
      questionText: currentQ.question,
      selectedIndex: selectedOption,
      correctIndex: currentQ.correctIndex,
      isCorrect,
      explanation: currentQ.explanation,
    };

    setUserAnswers(prev => [...prev, answerRecord]);
  };

  const handleNextQuestion = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsSubmitted(false);
    } else {
      // Completed!
      const correctCount = userAnswers.filter(a => a.isCorrect).length;
      const total = questions.length;
      const percentage = Math.round((correctCount / total) * 100);

      const attemptRecord: MCQAttempt = {
        id: `mcq-${Date.now()}`,
        timestamp: new Date().toISOString(),
        tech,
        difficulty,
        score: correctCount,
        total,
        percentage,
        answers: userAnswers,
      };

      onSaveAttempt(attemptRecord);
      setIsCompleted(true);
      onShowToast(`MCQ Quiz Completed! Score: ${correctCount}/${total} (${percentage}%)`, 'success');
    }
  };

  const handleRestartQuiz = () => {
    loadQuestions();
  };

  return (
    <div className="max-w-3xl mx-auto py-6 px-4 space-y-6">
      {/* Header Selector Bar */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <div>
            <h1 className="font-bold text-base text-zinc-900 dark:text-zinc-100">
              Technical MCQ Practice
            </h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Multiple choice speed round with instant answer feedback.
            </p>
          </div>
        </div>

        {/* Tech Selector */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={tech}
            onChange={e => setTech(e.target.value as Technology)}
            className="px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs text-zinc-800 dark:text-zinc-200 font-semibold focus:outline-none w-full sm:w-auto"
          >
            {ALL_TECHNOLOGIES.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main MCQ Question Card or Final Result */}
      {!isCompleted ? (
        currentQ ? (
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 p-6 shadow-xs space-y-6">
            {/* Top Question Progress */}
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Question {currentIndex + 1} of {questions.length}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                {currentQ.topic}
              </span>
            </div>

            {/* Question Text */}
            <div className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100 leading-snug">
                {currentQ.question}
              </h2>

              {currentQ.codeSnippet && (
                <div className="rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950 p-3.5 font-mono text-xs text-emerald-300">
                  <pre><code>{currentQ.codeSnippet}</code></pre>
                </div>
              )}
            </div>

            {/* MCQ Options List */}
            <div className="space-y-2.5">
              {currentQ.options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === currentQ.correctIndex;

                let optionStyle = 'bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 hover:border-zinc-300 dark:hover:border-zinc-600';

                if (isSubmitted) {
                  if (isCorrect) {
                    optionStyle = 'bg-emerald-500/10 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-semibold';
                  } else if (isSelected && !isCorrect) {
                    optionStyle = 'bg-rose-500/10 border-rose-500 text-rose-700 dark:text-rose-300';
                  }
                } else if (isSelected) {
                  optionStyle = 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 text-indigo-950 dark:text-indigo-100 font-semibold ring-2 ring-indigo-500/20';
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full p-4 rounded-xl border text-left text-xs sm:text-sm transition-all flex items-center justify-between cursor-pointer ${optionStyle}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-lg bg-zinc-200/60 dark:bg-zinc-700/60 text-zinc-700 dark:text-zinc-300 font-bold text-xs flex items-center justify-center shrink-0">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span>{opt}</span>
                    </div>

                    {isSubmitted && isCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                    )}
                    {isSubmitted && isSelected && !isCorrect && (
                      <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation box when submitted */}
            {isSubmitted && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 space-y-1 text-xs text-zinc-800 dark:text-zinc-200"
              >
                <span className="font-bold text-indigo-700 dark:text-indigo-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-500" /> Technical Explanation:
                </span>
                <p className="leading-relaxed font-sans">{currentQ.explanation}</p>
              </motion.div>
            )}

            {/* Bottom Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              {!isSubmitted ? (
                <button
                  type="button"
                  onClick={handleSubmitAnswer}
                  disabled={selectedOption === null}
                  className="px-6 py-2.5 rounded-xl font-semibold text-xs text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-indigo-600/20 cursor-pointer"
                >
                  Confirm Answer
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleNextQuestion}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-xs text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 cursor-pointer"
                >
                  <span>{currentIndex + 1 < questions.length ? 'Next Question' : 'View MCQ Results'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="p-8 text-center text-zinc-400">Loading questions...</div>
        )
      ) : (
        /* Final MCQ Report Card */
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 p-8 shadow-xs text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <Award className="w-4 h-4 text-emerald-500" />
            MCQ Test Completed
          </div>

          <div>
            <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-50">
              {tech} Practice Test Score
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              You answered {userAnswers.filter(a => a.isCorrect).length} out of {questions.length} questions correctly.
            </p>
          </div>

          <div className="text-4xl font-black text-indigo-600 dark:text-indigo-400">
            {Math.round((userAnswers.filter(a => a.isCorrect).length / questions.length) * 100)}%
          </div>

          <div className="flex justify-center gap-3 pt-4">
            <button
              onClick={handleRestartQuiz}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-xs font-semibold hover:bg-indigo-100 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retake MCQ Quiz</span>
            </button>

            <button
              onClick={onBackToDashboard}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-xs hover:bg-indigo-700 shadow-md cursor-pointer"
            >
              View Progress Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
