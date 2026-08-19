import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProgress, InterviewResult, Technology } from '../types';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  CartesianGrid 
} from 'recharts';
import { 
  Trophy, 
  CheckCircle2, 
  BrainCircuit, 
  BarChart3, 
  Code, 
  Trash2, 
  RotateCcw, 
  ChevronRight, 
  X, 
  Sparkles,
  Award,
  Layers,
  BookOpen
} from 'lucide-react';

interface ProgressDashboardProps {
  progress: UserProgress;
  onClearHistory: () => void;
  onResetSampleData: () => void;
  onStartNewInterview: () => void;
  onPracticeMCQ: () => void;
}

export const ProgressDashboard: React.FC<ProgressDashboardProps> = ({
  progress,
  onClearHistory,
  onResetSampleData,
  onStartNewInterview,
  onPracticeMCQ,
}) => {
  const [selectedResult, setSelectedResult] = useState<InterviewResult | null>(null);
  const [techFilter, setTechFilter] = useState<string>('ALL');

  // Filter history
  const filteredHistory = progress.history.filter(item => {
    if (techFilter === 'ALL') return true;
    return item.config.technology === techFilter;
  });

  // Prepare Chart Data
  const scoreTrendData = [...progress.history].reverse().map((item, idx) => ({
    session: `#${idx + 1}`,
    score: item.averageScore,
    tech: item.config.technology,
    date: new Date(item.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' }),
  }));

  const techBreakdownData = (Object.entries(progress.techStats) as [string, { count: number; avgScore: number }][])
    .filter(([_, data]) => data.count > 0)
    .map(([tech, data]) => ({
      technology: tech,
      avgScore: data.avgScore,
      count: data.count,
    }));

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 space-y-8">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
              Progress & Analytics Dashboard
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              Live Tracker
            </span>
          </div>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Track your score history, technology masteries, and identify weak topics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onStartNewInterview}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>New Interview</span>
          </button>

          <button
            onClick={onPracticeMCQ}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 font-semibold text-xs transition-colors cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
            <span>Practice MCQ</span>
          </button>
        </div>
      </div>

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Average Score */}
        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-zinc-400 font-medium">
            <span>Average Score</span>
            <Trophy className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-50">
            {progress.averageScore} <span className="text-xs font-normal text-zinc-400">/ 10</span>
          </div>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400">Overall average rating</p>
        </div>

        {/* Total Interviews */}
        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-zinc-400 font-medium">
            <span>Sessions Taken</span>
            <BarChart3 className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-50">
            {progress.totalInterviews}
          </div>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400">Completed mock interviews</p>
        </div>

        {/* Total Questions Answered */}
        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-zinc-400 font-medium">
            <span>Questions Answered</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-50">
            {progress.totalQuestionsAnswered}
          </div>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400">Total technical questions</p>
        </div>

        {/* Best Score */}
        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-zinc-400 font-medium">
            <span>Highest Rating</span>
            <Award className="w-4 h-4 text-cyan-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-50">
            {progress.bestScore} <span className="text-xs font-normal text-zinc-400">/ 10</span>
          </div>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400">Personal best session</p>
        </div>
      </div>

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Score History Line Chart */}
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-indigo-500" />
              Score Progression Trend
            </h2>
            <span className="text-[11px] text-zinc-400 font-mono">Recent Sessions</span>
          </div>

          {scoreTrendData.length > 0 ? (
            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={scoreTrendData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="session" stroke="#a1a1aa" fontSize={11} />
                  <YAxis domain={[0, 10]} stroke="#a1a1aa" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--chart-tooltip-bg)',
                      borderColor: 'var(--chart-tooltip-border)',
                      borderRadius: '12px',
                      color: 'var(--chart-tooltip-text)',
                      fontSize: '12px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    }}
                    itemStyle={{ color: 'var(--chart-tooltip-text)' }}
                    labelStyle={{ color: 'var(--chart-tooltip-text)', fontWeight: 600 }}
                    formatter={(value: any) => [`Score: ${value} / 10`, 'Performance']}
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#6366f1"
                    strokeWidth={3}
                    dot={{ r: 4, fill: '#6366f1' }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-xs text-zinc-400 italic">
              No session data available yet.
            </div>
          )}
        </div>

        {/* Technology Mastery Bar Chart */}
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Code className="w-4 h-4 text-emerald-500" />
              Average Score by Technology
            </h2>
            <span className="text-[11px] text-zinc-400 font-mono">Practiced Tech</span>
          </div>

          {techBreakdownData.length > 0 ? (
            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={techBreakdownData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="technology" stroke="#a1a1aa" fontSize={11} />
                  <YAxis domain={[0, 10]} stroke="#a1a1aa" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--chart-tooltip-bg)',
                      borderColor: 'var(--chart-tooltip-border)',
                      borderRadius: '12px',
                      color: 'var(--chart-tooltip-text)',
                      fontSize: '12px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    }}
                    itemStyle={{ color: 'var(--chart-tooltip-text)' }}
                    labelStyle={{ color: 'var(--chart-tooltip-text)', fontWeight: 600 }}
                    formatter={(value: any) => [`${value} / 10`, 'Avg Score']}
                  />
                  <Bar dataKey="avgScore" fill="#10b981" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-xs text-zinc-400 italic">
              Take an interview to populate technology mastery stats.
            </div>
          )}
        </div>
      </div>

      {/* Strong vs Weak Topics Tags Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 space-y-3">
          <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
            Verified Strong Topics
          </h3>
          <div className="flex flex-wrap gap-2">
            {progress.strongTopics.length > 0 ? (
              progress.strongTopics.map((topic, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-lg text-xs font-medium bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800"
                >
                  {topic}
                </span>
              ))
            ) : (
              <span className="text-xs text-zinc-400 italic">No strong topics recorded yet.</span>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 space-y-3">
          <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2 text-amber-600 dark:text-amber-400">
            <BrainCircuit className="w-4 h-4" />
            Weak Topics & Focus Areas
          </h3>
          <div className="flex flex-wrap gap-2">
            {progress.weakTopics.length > 0 ? (
              progress.weakTopics.map((topic, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-lg text-xs font-medium bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800"
                >
                  {topic}
                </span>
              ))
            ) : (
              <span className="text-xs text-zinc-400 italic">No weak topics flagged! Keep up the good work.</span>
            )}
          </div>
        </div>
      </div>

      {/* Previous Interviews History Log */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 overflow-hidden shadow-xs space-y-4 p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              Previous Interview Attempts
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Click any attempt to inspect question feedback and takeaways.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={techFilter}
              onChange={e => setTechFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs text-zinc-700 dark:text-zinc-300 font-medium focus:outline-none"
            >
              <option value="ALL">All Technologies</option>
              {Object.keys(progress.techStats).map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>

            <button
              onClick={onResetSampleData}
              title="Reset Sample Data"
              className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={onClearHistory}
              title="Clear All History"
              className="p-2 rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/60 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* History Table */}
        <div className="overflow-x-auto">
          {filteredHistory.length > 0 ? (
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-50 dark:bg-zinc-800/60 text-zinc-500 dark:text-zinc-400 uppercase font-semibold text-[10px] tracking-wider border-y border-zinc-200/80 dark:border-zinc-800">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Technology</th>
                  <th className="py-3 px-4">Difficulty</th>
                  <th className="py-3 px-4">Score</th>
                  <th className="py-3 px-4">Questions</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/80">
                {filteredHistory.map(item => (
                  <tr
                    key={item.id}
                    onClick={() => setSelectedResult(item)}
                    className="hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40 transition-colors cursor-pointer"
                  >
                    <td className="py-3.5 px-4 font-mono text-zinc-500 dark:text-zinc-400">
                      {new Date(item.timestamp).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-zinc-900 dark:text-zinc-100">
                      {item.config.technology}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                        {item.config.difficulty}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`font-bold ${item.averageScore >= 8 ? 'text-emerald-600 dark:text-emerald-400' : item.averageScore >= 6 ? 'text-indigo-600 dark:text-indigo-400' : 'text-amber-600 dark:text-amber-400'}`}>
                        {item.averageScore} / 10 ({item.percentage}%)
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-zinc-600 dark:text-zinc-400">
                      {item.attemptedQuestions} / {item.totalQuestions}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button className="text-indigo-600 dark:text-indigo-400 font-semibold inline-flex items-center gap-1 hover:underline">
                        <span>View</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-12 text-zinc-400 text-xs italic">
              No interview records found for the selected filter.
            </div>
          )}
        </div>
      </div>

      {/* Inspect Modal for Selected Interview Attempt */}
      {selectedResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800">
              <div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                  {selectedResult.config.technology} Interview Attempt
                </h3>
                <p className="text-xs text-zinc-400">
                  {new Date(selectedResult.timestamp).toLocaleString()} • {selectedResult.config.difficulty}
                </p>
              </div>

              <button
                onClick={() => setSelectedResult(null)}
                className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50">
                <span className="font-bold text-indigo-700 dark:text-indigo-300 block mb-1">
                  Overall Rating: {selectedResult.averageScore} / 10 ({selectedResult.percentage}%)
                </span>
                <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  {selectedResult.overallFeedback}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700">
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 block mb-1">Strong Topics</span>
                  <p className="text-zinc-600 dark:text-zinc-300">{selectedResult.strongTopics.join(', ') || 'N/A'}</p>
                </div>
                <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700">
                  <span className="font-bold text-amber-600 dark:text-amber-400 block mb-1">Weak Topics</span>
                  <p className="text-zinc-600 dark:text-zinc-300">{selectedResult.weakTopics.join(', ') || 'N/A'}</p>
                </div>
              </div>

              <div className="pt-2 text-right">
                <button
                  onClick={() => setSelectedResult(null)}
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold text-xs hover:bg-indigo-700 cursor-pointer"
                >
                  Close Inspection
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
