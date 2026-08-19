import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  InterviewConfig, 
  Question, 
  ChatMessage, 
  AnswerEvaluation, 
  InterviewResult 
} from '../types';
import { ChatMessageBubble } from './ChatMessageBubble';
import { AnswerInput } from './AnswerInput';
import { 
  Bot, 
  Sparkles, 
  Clock, 
  LogOut, 
  Volume2, 
  VolumeX, 
  AlertCircle, 
  HelpCircle,
  Lightbulb,
  CheckCircle2
} from 'lucide-react';

interface ChatWindowProps {
  config: InterviewConfig;
  questions: Question[];
  onCompleteInterview: (result: InterviewResult) => void;
  onCancelInterview: () => void;
  onShowToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  config,
  questions,
  onCompleteInterview,
  onCancelInterview,
  onShowToast,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [evaluations, setEvaluations] = useState<AnswerEvaluation[]>([]);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [audioSpeechEnabled, setAudioSpeechEnabled] = useState(false);
  const [showEndModal, setShowEndModal] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Timer interval
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsElapsed(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Read question text out loud if speech is enabled
  const speakQuestion = (text: string) => {
    if (!audioSpeechEnabled || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.error('Speech error:', err);
    }
  };

  // Initial Question setup on mount
  useEffect(() => {
    if (questions.length > 0 && messages.length === 0) {
      const q = questions[0];
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const initialMsg: ChatMessage = {
          id: `msg-q-0`,
          sender: 'interviewer',
          text: `Welcome to your ${config.technology} (${config.difficulty}) mock interview! I will ask you ${questions.length} questions. Here is Question 1:\n\n${q.text}`,
          codeSnippet: q.codeSnippet,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          questionId: q.id,
          questionIndex: 0,
          isQuestion: true,
        };
        setMessages([initialMsg]);
        speakQuestion(q.text);
      }, 1200);
    }
  }, [questions]);

  // Format time display MM:SS
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Process User Answer Submission
  const handleSubmitAnswer = async (userAnswerText: string) => {
    const currentQ = questions[currentQuestionIndex];
    if (!currentQ) return;

    // Append User Message
    const userMsg: ChatMessage = {
      id: `msg-user-${Date.now()}`,
      sender: 'user',
      text: userAnswerText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);
    setIsTyping(true);

    try {
      const res = await fetch('/api/evaluate-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionText: currentQ.text,
          userAnswer: userAnswerText,
          tech: config.technology,
          difficulty: config.difficulty,
          topic: currentQ.topic,
        }),
      });

      const data = await res.json();
      const evalResult: AnswerEvaluation = data.evaluation || {
        score: 7,
        scoreOutOf10: 7,
        correctPoints: ['Addressed main points of the prompt.'],
        missingPoints: ['Could include more technical details.'],
        suggestions: ['Review core documentation.'],
        modelAnswer: currentQ.sampleAnswer || 'Provide a complete technical answer.',
        difficulty: config.difficulty,
        topic: currentQ.topic,
      };

      setEvaluations(prev => [...prev, evalResult]);

      // Interviewer feedback message with evaluation attached
      const feedbackMsg: ChatMessage = {
        id: `msg-eval-${Date.now()}`,
        sender: 'interviewer',
        text: `Thank you for your response to Question ${currentQuestionIndex + 1}. Here is my real-time evaluation:`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        evaluation: evalResult,
      };

      setMessages(prev => [...prev, feedbackMsg]);
      setIsLoading(false);
      setIsTyping(false);

      // Advance to Next Question or Finalize
      const nextIndex = currentQuestionIndex + 1;
      if (nextIndex < questions.length) {
        setTimeout(() => {
          setCurrentQuestionIndex(nextIndex);
          setShowHint(false);
          const nextQ = questions[nextIndex];
          setIsTyping(true);

          setTimeout(() => {
            setIsTyping(false);
            const nextQMsg: ChatMessage = {
              id: `msg-q-${nextIndex}`,
              sender: 'interviewer',
              text: `Question ${nextIndex + 1} of ${questions.length}:\n\n${nextQ.text}`,
              codeSnippet: nextQ.codeSnippet,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              questionId: nextQ.id,
              questionIndex: nextIndex,
              isQuestion: true,
            };
            setMessages(prev => [...prev, nextQMsg]);
            speakQuestion(nextQ.text);
          }, 1000);
        }, 1200);
      } else {
        // All questions completed! Compile final InterviewResult
        setTimeout(() => {
          finalizeInterview(evaluations.concat(evalResult));
        }, 1500);
      }
    } catch (error) {
      console.error('Error evaluating answer:', error);
      onShowToast('Failed to connect to evaluation engine.', 'error');
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  // Skip Question
  const handleSkipQuestion = () => {
    handleSubmitAnswer('[Skipped]');
  };

  // Finalize Interview and generate result report
  const finalizeInterview = (allEvals: AnswerEvaluation[]) => {
    const attempted = allEvals.length;
    const scoreSum = allEvals.reduce((acc, curr) => acc + curr.score, 0);
    const avgScore = attempted > 0 ? Number((scoreSum / attempted).toFixed(1)) : 0;
    const percentage = Math.round((avgScore / 10) * 100);

    const strongTopics = Array.from(
      new Set(allEvals.filter(e => e.score >= 7.5).map(e => e.topic))
    );
    const weakTopics = Array.from(
      new Set(allEvals.filter(e => e.score < 7.5).map(e => e.topic))
    );

    const result: InterviewResult = {
      id: `inv-${Date.now()}`,
      timestamp: new Date().toISOString(),
      config,
      messages,
      totalQuestions: questions.length,
      attemptedQuestions: attempted,
      averageScore: avgScore,
      percentage,
      strongTopics: strongTopics.length > 0 ? strongTopics : ['Basic Concepts'],
      weakTopics: weakTopics.length > 0 ? weakTopics : ['Detailed Specs'],
      overallFeedback: `You completed the ${config.technology} (${config.difficulty}) interview with an average score of ${avgScore}/10 (${percentage}%). ${
        percentage >= 80
          ? 'Great technical depth and clarity!'
          : percentage >= 60
          ? 'Solid foundational knowledge with room for optimization.'
          : 'Focus on practicing fundamental principles and syntax.'
      }`,
      keyTakeaways: [
        'Review topics tagged in the weak areas section',
        'Practice explaining technical decisions with code examples',
      ],
    };

    onCompleteInterview(result);
  };

  const currentQ = questions[currentQuestionIndex];

  return (
    <div className="max-w-4xl mx-auto py-2 px-2 sm:px-4 space-y-4">
      {/* Top Session Progress Bar & Controls */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
            {currentQuestionIndex + 1}/{questions.length}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                {config.technology} Interview
              </span>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800">
                {config.difficulty}
              </span>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Topic: <span className="font-medium text-zinc-700 dark:text-zinc-300">{currentQ?.topic || 'General'}</span>
            </p>
          </div>
        </div>

        {/* Middle Progress bar */}
        <div className="w-full sm:max-w-xs space-y-1">
          <div className="flex justify-between text-[11px] text-zinc-500 font-medium">
            <span>Progress</span>
            <span>{Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-600 to-cyan-500 transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Right Side Tools */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Timer */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300 font-mono text-xs font-semibold">
            <Clock className="w-3.5 h-3.5 text-indigo-500" />
            <span>{formatTime(secondsElapsed)}</span>
          </div>

          {/* Speech Toggle */}
          <button
            onClick={() => setAudioSpeechEnabled(!audioSpeechEnabled)}
            title={audioSpeechEnabled ? 'Mute AI Voice' : 'Enable AI Voice Question Read-Aloud'}
            className={`p-2 rounded-xl border transition-colors cursor-pointer ${
              audioSpeechEnabled
                ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-600 dark:text-indigo-400'
                : 'bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400'
            }`}
          >
            {audioSpeechEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* End Interview button */}
          <button
            onClick={() => setShowEndModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/60 font-semibold text-xs transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">End Interview</span>
          </button>
        </div>
      </div>

      {/* Main Chat Conversation Display */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 shadow-xs overflow-hidden flex flex-col h-[520px]">
        {/* Chat Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map(msg => (
            <ChatMessageBubble
              key={msg.id}
              message={msg}
              onCopyText={msg => onShowToast(msg, 'success')}
            />
          ))}

          {/* Typing Animation */}
          {isTyping && (
            <div className="flex gap-3 items-center my-3">
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Bot className="w-4 h-4" />
              </div>
              <div className="px-4 py-3 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-500 text-xs flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                <span className="ml-1 text-[11px] font-medium text-zinc-400">Interviewer is formulating response...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Question Hint Dropdown */}
        {currentQ?.hint && (
          <div className="px-4 py-2 border-t border-zinc-100 dark:border-zinc-800/80 bg-indigo-50/30 dark:bg-indigo-950/20 flex items-center justify-between text-xs">
            <button
              onClick={() => setShowHint(!showHint)}
              className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 font-semibold hover:underline cursor-pointer"
            >
              <Lightbulb className="w-3.5 h-3.5" />
              <span>{showHint ? 'Hide Question Hint' : 'Need a hint?'}</span>
            </button>

            {showHint && (
              <span className="text-zinc-600 dark:text-zinc-400 font-sans italic animate-fadeIn">
                Hint: {currentQ.hint}
              </span>
            )}
          </div>
        )}

        {/* Bottom Input Field */}
        <AnswerInput
          onSubmitAnswer={handleSubmitAnswer}
          onSkipQuestion={handleSkipQuestion}
          isLoading={isLoading || isTyping}
        />
      </div>

      {/* Confirmation Modal for End Interview */}
      {showEndModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl max-w-md w-full shadow-2xl space-y-4"
          >
            <div className="flex items-center gap-3 text-rose-600 dark:text-rose-400">
              <AlertCircle className="w-6 h-6" />
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                End Interview Session?
              </h3>
            </div>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Are you sure you want to exit? You have answered {evaluations.length} of {questions.length} questions. You can generate a report for questions answered so far or cancel.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowEndModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 cursor-pointer"
              >
                Resume Interview
              </button>
              <button
                onClick={() => {
                  setShowEndModal(false);
                  finalizeInterview(evaluations);
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 cursor-pointer shadow-md"
              >
                End & View Score
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
