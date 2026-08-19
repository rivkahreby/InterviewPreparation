import React from 'react';
import { motion } from 'motion/react';
import { 
  Bot, 
  Play, 
  BookOpen, 
  BarChart3, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  Code, 
  MessageSquareCode,
  ArrowRight
} from 'lucide-react';
import { ALL_TECHNOLOGIES } from '../utils/storage';

interface LandingHeroProps {
  onStartInterview: () => void;
  onPracticeMCQ: () => void;
  onViewProgress: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onStartInterview,
  onPracticeMCQ,
  onViewProgress,
}) => {
  return (
    <div className="space-y-16 py-6 md:py-12">
      {/* Hero Header Section */}
      <section className="text-center space-y-6 max-w-4xl mx-auto px-4">
        {/* Top Tag Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide bg-indigo-50 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60 shadow-xs"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
          <span>AI-Powered Technical Interview Simulator for Freshers & Students</span>
        </motion.div>

        {/* Title & Subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-3"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
            InterviewPrep <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500">AI</span>
          </h1>
          <p className="text-xl sm:text-2xl font-semibold text-zinc-700 dark:text-zinc-300">
            Prepare smarter. Interview better.
          </p>
        </motion.div>

        {/* Short Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed"
        >
          Practice real-time technical interviews across Java, Python, JavaScript, React, and C++ with an AI interviewer. Get instant score breakdowns out of 10, missing points, and actionable feedback to land your dream software developer role.
        </motion.p>

        {/* Primary CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4"
        >
          <button
            onClick={onStartInterview}
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 shadow-lg shadow-indigo-600/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Start Technical Interview</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onPracticeMCQ}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-medium text-zinc-800 dark:text-zinc-200 bg-zinc-100 hover:bg-zinc-200/80 dark:bg-zinc-800/80 dark:hover:bg-zinc-700/80 border border-zinc-200 dark:border-zinc-700 transition-colors cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-indigo-500" />
            <span>Practice MCQ Test</span>
          </button>

          <button
            onClick={onViewProgress}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-medium text-zinc-700 dark:text-zinc-300 bg-white hover:bg-zinc-50 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 transition-colors cursor-pointer"
          >
            <BarChart3 className="w-4 h-4 text-emerald-500" />
            <span>View Progress</span>
          </button>
        </motion.div>

        {/* Technology Badges */}
        <div className="pt-6 border-t border-zinc-200/80 dark:border-zinc-800/80 max-w-3xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-3">
            Supported Technologies & Languages
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {ALL_TECHNOLOGIES.map(tech => (
              <span
                key={tech}
                className="px-3 py-1 rounded-lg text-xs font-medium bg-zinc-100 dark:bg-zinc-800/60 text-zinc-700 dark:text-zinc-300 border border-zinc-200/60 dark:border-zinc-700/60 flex items-center gap-1.5"
              >
                <Code className="w-3 h-3 text-indigo-500" />
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Core Workflow Steps */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="text-center space-y-2 mb-8">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            How InterviewPrep AI Works
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Three simple steps to boost your technical confidence before your real interview.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Step 1 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-xs relative overflow-hidden group hover:border-indigo-500/50 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-base mb-4 border border-indigo-100 dark:border-indigo-900">
              1
            </div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-2">
              Configure Your Practice
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Select your target technology (Java, Python, JS, React, etc.), set difficulty (Beginner, Intermediate, Advanced), and choose question count.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-xs relative overflow-hidden group hover:border-indigo-500/50 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-base mb-4 border border-indigo-100 dark:border-indigo-900">
              2
            </div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-2">
              Interactive AI Interview
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Answer one question at a time in a clean chatbot window. Type explanations or code snippets with full editor controls.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-xs relative overflow-hidden group hover:border-indigo-500/50 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-base mb-4 border border-indigo-100 dark:border-indigo-900">
              3
            </div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-2">
              Instant Answer Evaluation
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Get score ratings out of 10, correct points, missing technical details, model answers, and weak topic diagnostic reports.
            </p>
          </div>
        </div>
      </section>

      {/* Key Feature Highlights */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-900/10 via-zinc-900/5 to-zinc-900/0 dark:from-indigo-950/40 dark:to-zinc-900/40 border border-indigo-100 dark:border-indigo-900/50 flex gap-4 items-start">
            <div className="p-3 rounded-xl bg-indigo-600 text-white shrink-0">
              <MessageSquareCode className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                Realistic Chatbot Experience
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Simulates real software engineering technical interviews with typing animations, code block formatting, and instant step-by-step questions.
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-900/10 via-zinc-900/5 to-zinc-900/0 dark:from-emerald-950/40 dark:to-zinc-900/40 border border-emerald-100 dark:border-emerald-900/50 flex gap-4 items-start">
            <div className="p-3 rounded-xl bg-emerald-600 text-white shrink-0">
              <Zap className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                MCQ & Technical Modes
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Practice open-ended architectural/coding questions or multiple-choice speed rounds with instant explanations.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
