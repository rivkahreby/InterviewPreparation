import React, { useState } from 'react';
import { AnswerEvaluation } from '../types';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Lightbulb, 
  BookOpen, 
  ChevronDown, 
  ChevronUp, 
  Award,
  Sparkles 
} from 'lucide-react';

interface FeedbackCardProps {
  evaluation: AnswerEvaluation;
}

export const FeedbackCard: React.FC<FeedbackCardProps> = ({ evaluation }) => {
  const [showModelAnswer, setShowModelAnswer] = useState(false);

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30';
    if (score >= 5) return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30';
    return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30';
  };

  return (
    <div className="mt-3 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/90 space-y-3.5 text-xs sm:text-sm">
      {/* Top Header: Score Rating Badge */}
      <div className="flex items-center justify-between pb-2 border-b border-zinc-200/80 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="font-bold text-zinc-900 dark:text-zinc-100">
            AI Answer Evaluation
          </span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-zinc-200/70 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
            {evaluation.topic}
          </span>
        </div>

        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border font-bold text-xs ${getScoreColor(evaluation.score)}`}>
          <Award className="w-3.5 h-3.5" />
          <span>Score: {evaluation.score} / 10</span>
        </div>
      </div>

      {/* Correct Points */}
      {evaluation.correctPoints && evaluation.correctPoints.length > 0 && (
        <div className="space-y-1">
          <span className="font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5 text-xs">
            <CheckCircle2 className="w-3.5 h-3.5" /> What You Answered Correctly:
          </span>
          <ul className="list-disc list-inside space-y-0.5 text-zinc-700 dark:text-zinc-300 pl-1 text-xs">
            {evaluation.correctPoints.map((pt, idx) => (
              <li key={idx}>{pt}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Missing Points */}
      {evaluation.missingPoints && evaluation.missingPoints.length > 0 && (
        <div className="space-y-1">
          <span className="font-semibold text-amber-700 dark:text-amber-400 flex items-center gap-1.5 text-xs">
            <AlertTriangle className="w-3.5 h-3.5" /> Missing Points / Areas to Note:
          </span>
          <ul className="list-disc list-inside space-y-0.5 text-zinc-700 dark:text-zinc-300 pl-1 text-xs">
            {evaluation.missingPoints.map((pt, idx) => (
              <li key={idx}>{pt}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Improvement Suggestions */}
      {evaluation.suggestions && evaluation.suggestions.length > 0 && (
        <div className="space-y-1">
          <span className="font-semibold text-indigo-700 dark:text-indigo-400 flex items-center gap-1.5 text-xs">
            <Lightbulb className="w-3.5 h-3.5" /> Suggestions for Improvement:
          </span>
          <ul className="list-disc list-inside space-y-0.5 text-zinc-700 dark:text-zinc-300 pl-1 text-xs">
            {evaluation.suggestions.map((pt, idx) => (
              <li key={idx}>{pt}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Model Answer Toggle */}
      {evaluation.modelAnswer && (
        <div className="pt-1 border-t border-zinc-200/60 dark:border-zinc-800/60">
          <button
            onClick={() => setShowModelAnswer(!showModelAnswer)}
            className="flex items-center justify-between w-full text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer py-1"
          >
            <span className="flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              {showModelAnswer ? 'Hide Sample Model Answer' : 'View Sample Model Answer'}
            </span>
            {showModelAnswer ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showModelAnswer && (
            <div className="mt-2 p-3 rounded-lg bg-indigo-50/50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 text-xs text-zinc-800 dark:text-zinc-200 font-mono leading-relaxed">
              {evaluation.modelAnswer}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
