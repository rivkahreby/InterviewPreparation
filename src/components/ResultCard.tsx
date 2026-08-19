import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { InterviewResult } from '../types';
import { 
  Award, 
  CheckCircle2, 
  AlertTriangle, 
  RotateCcw, 
  LayoutDashboard, 
  Copy, 
  Check, 
  TrendingUp, 
  Sparkles,
  BarChart2,
  FileText
} from 'lucide-react';

interface ResultCardProps {
  result: InterviewResult;
  onRetry: () => void;
  onBackToDashboard: () => void;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const ResultCard: React.FC<ResultCardProps> = ({
  result,
  onRetry,
  onBackToDashboard,
  onShowToast,
}) => {
  const [copied, setCopied] = React.useState(false);

  useEffect(() => {
    if (result.percentage >= 70) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (err) {
        console.error('Confetti trigger error:', err);
      }
    }
  }, [result]);

  const handleCopyReport = () => {
    const reportText = `InterviewPrep AI Performance Report
--------------------------------------
Technology: ${result.config.technology} (${result.config.difficulty})
Overall Score: ${result.averageScore} / 10 (${result.percentage}%)
Questions Attempted: ${result.attemptedQuestions} / ${result.totalQuestions}
Strong Topics: ${result.strongTopics.join(', ') || 'N/A'}
Weak Topics: ${result.weakTopics.join(', ') || 'N/A'}

Feedback:
${result.overallFeedback}
`;
    navigator.clipboard.writeText(reportText);
    setCopied(true);
    onShowToast('Summary report copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const getScoreBadge = (score: number) => {
    if (score >= 8) return { label: 'Excellent Performance', color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800' };
    if (score >= 6) return { label: 'Good Understanding', color: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-800' };
    return { label: 'Needs Practice', color: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800' };
  };

  const badge = getScoreBadge(result.averageScore);

  return (
    <div className="max-w-3xl mx-auto py-6 px-4 space-y-6">
      {/* Top Banner Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 p-6 sm:p-8 shadow-xs text-center space-y-6 relative overflow-hidden"
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          Interview Completed
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-50">
            {result.config.technology} ({result.config.difficulty}) Interview Score
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Completed on {new Date(result.timestamp).toLocaleDateString()} at {new Date(result.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>

        {/* Score Display Ring / Metric */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 py-2">
          {/* Circular Score Gauge */}
          <div className="relative w-36 h-36 flex items-center justify-center rounded-full bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-1 shadow-lg shadow-indigo-500/20">
            <div className="w-full h-full bg-white dark:bg-zinc-950 rounded-full flex flex-col items-center justify-center p-2">
              <span className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50">
                {result.averageScore}
              </span>
              <span className="text-xs font-semibold text-zinc-400">out of 10</span>
              <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 mt-0.5">
                {result.percentage}%
              </span>
            </div>
          </div>

          <div className="text-left space-y-2 max-w-sm">
            <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${badge.color}`}>
              {badge.label}
            </div>
            <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed font-sans">
              {result.overallFeedback}
            </p>
          </div>
        </div>

        {/* Breakdown Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800/80">
          <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-800 text-center">
            <span className="block text-xs text-zinc-400 font-medium">Attempted</span>
            <span className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              {result.attemptedQuestions} / {result.totalQuestions}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-800 text-center">
            <span className="block text-xs text-zinc-400 font-medium">Strong Topics</span>
            <span className="text-base font-bold text-emerald-600 dark:text-emerald-400">
              {result.strongTopics.length}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-800 text-center col-span-2 sm:col-span-1">
            <span className="block text-xs text-zinc-400 font-medium">Weak Topics</span>
            <span className="text-base font-bold text-amber-600 dark:text-amber-400">
              {result.weakTopics.length}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Strong vs Weak Topics Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Strong Topics */}
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 space-y-3">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
            <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
              Strong Topics & Correct Concepts
            </h3>
          </div>
          {result.strongTopics.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {result.strongTopics.map((topic, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-lg text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                >
                  {topic}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-zinc-400 italic">No specific strong topics flagged.</p>
          )}
        </div>

        {/* Weak Topics */}
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 space-y-3">
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
            <AlertTriangle className="w-5 h-5" />
            <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
              Weak Topics & Recommended Revision
            </h3>
          </div>
          {result.weakTopics.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {result.weakTopics.map((topic, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-lg text-xs font-semibold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
                >
                  {topic}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-zinc-400 italic">No major weak topics identified!</p>
          )}
        </div>
      </div>

      {/* Action Footer Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <button
          onClick={handleCopyReport}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 font-semibold text-xs transition-colors cursor-pointer"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? 'Report Copied' : 'Copy Summary Report'}</span>
        </button>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={onRetry}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 font-semibold text-xs transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Retry Interview</span>
          </button>

          <button
            onClick={onBackToDashboard}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>
        </div>
      </div>
    </div>
  );
};
