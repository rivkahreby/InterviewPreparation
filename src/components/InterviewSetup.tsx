import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Technology, 
  Difficulty, 
  InterviewType, 
  QuestionCount, 
  InterviewConfig 
} from '../types';
import { 
  ALL_TECHNOLOGIES 
} from '../utils/storage';
import { 
  Play, 
  Code2, 
  Gauge, 
  Layers, 
  HelpCircle, 
  Sparkles,
  BookOpen
} from 'lucide-react';

interface InterviewSetupProps {
  onStartSession: (config: InterviewConfig) => void;
}

export const InterviewSetup: React.FC<InterviewSetupProps> = ({ onStartSession }) => {
  const [technology, setTechnology] = useState<Technology>('React JS');
  const [difficulty, setDifficulty] = useState<Difficulty>('Intermediate');
  const [questionCount, setQuestionCount] = useState<QuestionCount>(5);
  const [interviewType, setInterviewType] = useState<InterviewType>('Technical');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStartSession({
      technology,
      difficulty,
      questionCount,
      interviewType,
    });
  };

  const techDescriptions: Record<Technology, string> = {
    'Java': 'Core OOP, Collections, Multithreading, JVM Memory, Spring basics',
    'Python': 'Data structures, Generators, Decorators, Memory, GIL, Concurrency',
    'C': 'Pointers, Pointers to functions, Structs, Dynamic Memory, Macros',
    'C++': 'STL, RAII, Smart Pointers, Virtual Functions, Templates, Memory',
    'JavaScript': 'Event Loop, Promises, Closures, Scope, Prototypes, ES6+',
    'HTML/CSS': 'Box Model, Flexbox, Grid, Responsive Design, Semantic HTML',
    'React JS': 'Virtual DOM, Hooks, Re-renders, Context, Performance, State',
  };

  return (
    <div className="max-w-3xl mx-auto py-4 px-4 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          Interview Customizer
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
          Configure Your Mock Interview
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto">
          Tailor technology, difficulty level, and interview format to practice targeted technical concepts.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Step 1: Technology Selector */}
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Code2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              1. Select Technology
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {ALL_TECHNOLOGIES.map(tech => {
              const isSelected = technology === tech;
              return (
                <button
                  key={tech}
                  type="button"
                  onClick={() => setTechnology(tech)}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-indigo-50/80 dark:bg-indigo-950/60 border-indigo-500 text-indigo-950 dark:text-indigo-100 ring-2 ring-indigo-500/30'
                      : 'bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-700'
                  }`}
                >
                  <span className="font-bold text-sm tracking-tight">{tech}</span>
                  <span className="text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-1 mt-1">
                    {techDescriptions[tech]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Difficulty Level */}
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Gauge className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              2. Select Difficulty Level
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {(['Beginner', 'Intermediate', 'Advanced'] as Difficulty[]).map(diff => {
              const isSelected = difficulty === diff;
              return (
                <button
                  key={diff}
                  type="button"
                  onClick={() => setDifficulty(diff)}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-50/80 dark:bg-indigo-950/60 border-indigo-500 text-indigo-950 dark:text-indigo-100 ring-2 ring-indigo-500/30'
                      : 'bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm">{diff}</span>
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        diff === 'Beginner'
                          ? 'bg-emerald-500'
                          : diff === 'Intermediate'
                          ? 'bg-amber-500'
                          : 'bg-rose-500'
                      }`}
                    />
                  </div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {diff === 'Beginner' && 'Fundamental syntax & basic OOP'}
                    {diff === 'Intermediate' && 'Core mechanics & standard algorithms'}
                    {diff === 'Advanced' && 'System internals, async & performance'}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 3: Question Count & Interview Type */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Question Count */}
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                3. Number of Questions
              </h2>
            </div>

            <div className="flex gap-3">
              {([5, 10, 15] as QuestionCount[]).map(num => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setQuestionCount(num)}
                  className={`flex-1 py-3 rounded-xl border font-bold text-sm transition-all cursor-pointer ${
                    questionCount === num
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                      : 'bg-zinc-50 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                  }`}
                >
                  {num} Questions
                </button>
              ))}
            </div>
          </div>

          {/* Interview Type */}
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                4. Interview Format
              </h2>
            </div>

            <div className="flex gap-3">
              {(['Technical', 'MCQ'] as InterviewType[]).map(type => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setInterviewType(type)}
                  className={`flex-1 py-3 px-3 rounded-xl border font-bold text-sm transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    interviewType === type
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                      : 'bg-zinc-50 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                  }`}
                >
                  {type === 'Technical' ? <Code2 className="w-4 h-4" /> : <BookOpen className="w-4 h-4" />}
                  <span>{type}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Submit Action CTA */}
        <div className="pt-2">
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-base text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 shadow-lg shadow-indigo-600/25 transition-all cursor-pointer"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>Start {technology} ({difficulty}) Interview Session</span>
          </button>
        </div>
      </form>
    </div>
  );
};
