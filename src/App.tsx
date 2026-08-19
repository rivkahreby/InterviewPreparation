import React, { useState, useEffect } from 'react';
import { 
  InterviewConfig, 
  Question, 
  InterviewResult, 
  UserProgress, 
  MCQAttempt 
} from './types';
import { 
  getSavedProgress, 
  saveInterviewResult, 
  saveMCQAttempt, 
  clearAllProgress, 
  resetToSampleData 
} from './utils/storage';
import { Navbar } from './components/Navbar';
import { LandingHero } from './components/LandingHero';
import { InterviewSetup } from './components/InterviewSetup';
import { ChatWindow } from './components/ChatWindow';
import { ResultCard } from './components/ResultCard';
import { ProgressDashboard } from './components/ProgressDashboard';
import { MCQPractice } from './components/MCQPractice';
import { ToastContainer, ToastMessage } from './components/Toast';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'landing' | 'setup' | 'chat' | 'dashboard' | 'mcq' | 'result'>('landing');
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('interviewprep_theme');
    if (saved !== null) {
      return saved === 'dark';
    }
    return typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [progress, setProgress] = useState<UserProgress>(getSavedProgress);
  const [activeConfig, setActiveConfig] = useState<InterviewConfig | null>(null);
  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);
  const [activeResult, setActiveResult] = useState<InterviewResult | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [geminiActive, setGeminiActive] = useState<boolean>(false);
  const [isInitializingSession, setIsInitializingSession] = useState<boolean>(false);

  // Apply dark mode class to document root
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('interviewprep_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('interviewprep_theme', 'light');
    }
  }, [darkMode]);

  // Check Backend Health and Gemini Status
  useEffect(() => {
    fetch('/api/health')
      .then(res => res.json())
      .then(data => {
        if (data.geminiActive) {
          setGeminiActive(true);
        }
      })
      .catch(err => {
        console.warn('Backend health check warning:', err);
      });
  }, []);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = `toast-${Date.now()}`;
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  };

  const handleDismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Launch Session
  const handleStartSession = async (config: InterviewConfig) => {
    setActiveConfig(config);
    setIsInitializingSession(true);
    showToast(`Initializing ${config.technology} (${config.difficulty}) interview session...`, 'info');

    try {
      const res = await fetch('/api/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          technology: config.technology,
          difficulty: config.difficulty,
          count: config.questionCount,
        }),
      });

      const data = await res.json();
      if (data.questions && data.questions.length > 0) {
        setActiveQuestions(data.questions);
        setCurrentTab('chat');
        showToast('Questions generated successfully! Chatbot interviewer is ready.', 'success');
      } else {
        throw new Error('No questions returned');
      }
    } catch (err) {
      console.error('Error starting interview session:', err);
      showToast('Error generating questions. Please try again.', 'error');
    } finally {
      setIsInitializingSession(false);
    }
  };

  // Complete Interview
  const handleCompleteInterview = (result: InterviewResult) => {
    const updated = saveInterviewResult(result);
    setProgress(updated);
    setActiveResult(result);
    setCurrentTab('result');
    showToast('Interview session saved to progress history!', 'success');
  };

  // MCQ Attempt Save
  const handleSaveMCQAttempt = (attempt: MCQAttempt) => {
    const updated = saveMCQAttempt(attempt);
    setProgress(updated);
  };

  // Clear / Reset History
  const handleClearHistory = () => {
    const empty = clearAllProgress();
    setProgress(empty);
    showToast('All progress history cleared.', 'info');
  };

  const handleResetSampleData = () => {
    const sample = resetToSampleData();
    setProgress(sample);
    showToast('Sample dataset restored.', 'success');
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans transition-colors antialiased flex flex-col">
      {/* Navbar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={tab => setCurrentTab(tab)}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        geminiActive={geminiActive}
      />

      {/* Main App Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentTab === 'landing' && (
          <LandingHero
            onStartInterview={() => setCurrentTab('setup')}
            onPracticeMCQ={() => setCurrentTab('mcq')}
            onViewProgress={() => setCurrentTab('dashboard')}
          />
        )}

        {currentTab === 'setup' && (
          <InterviewSetup
            onStartSession={handleStartSession}
          />
        )}

        {currentTab === 'chat' && activeConfig && (
          <ChatWindow
            config={activeConfig}
            questions={activeQuestions}
            onCompleteInterview={handleCompleteInterview}
            onCancelInterview={() => setCurrentTab('setup')}
            onShowToast={showToast}
          />
        )}

        {currentTab === 'result' && activeResult && (
          <ResultCard
            result={activeResult}
            onRetry={() => setCurrentTab('setup')}
            onBackToDashboard={() => setCurrentTab('dashboard')}
            onShowToast={showToast}
          />
        )}

        {currentTab === 'dashboard' && (
          <ProgressDashboard
            progress={progress}
            onClearHistory={handleClearHistory}
            onResetSampleData={handleResetSampleData}
            onStartNewInterview={() => setCurrentTab('setup')}
            onPracticeMCQ={() => setCurrentTab('mcq')}
          />
        )}

        {currentTab === 'mcq' && (
          <MCQPractice
            onSaveAttempt={handleSaveMCQAttempt}
            onBackToDashboard={() => setCurrentTab('dashboard')}
            onShowToast={showToast}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50 py-6 text-center text-xs text-zinc-500 dark:text-zinc-400">
        <p>
          InterviewPrep AI • Smart Technical Interview Platform for Freshers & Students
        </p>
      </footer>

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />
    </div>
  );
}
