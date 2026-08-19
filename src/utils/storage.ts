import { InterviewResult, MCQAttempt, UserProgress, Technology } from '../types';
import { INITIAL_SAMPLE_HISTORY } from '../data/mockData';

const STORAGE_KEY = 'interviewprep_user_progress_v1';

export const ALL_TECHNOLOGIES: Technology[] = [
  'Java',
  'Python',
  'C',
  'C++',
  'JavaScript',
  'HTML/CSS',
  'React JS',
];

export function getDefaultTechStats(): Record<Technology, { count: number; avgScore: number }> {
  return {
    Java: { count: 0, avgScore: 0 },
    Python: { count: 0, avgScore: 0 },
    C: { count: 0, avgScore: 0 },
    'C++': { count: 0, avgScore: 0 },
    JavaScript: { count: 0, avgScore: 0 },
    'HTML/CSS': { count: 0, avgScore: 0 },
    'React JS': { count: 0, avgScore: 0 },
  };
}

export function calculateProgressFromHistory(
  history: InterviewResult[],
  mcqHistory: MCQAttempt[] = []
): UserProgress {
  if (history.length === 0) {
    return {
      totalInterviews: 0,
      totalQuestionsAnswered: 0,
      averageScore: 0,
      bestScore: 0,
      techStats: getDefaultTechStats(),
      strongTopics: [],
      weakTopics: [],
      history: [],
      mcqHistory,
    };
  }

  let totalQuestions = 0;
  let totalScoreSum = 0;
  let bestScore = 0;
  const techStats = getDefaultTechStats();
  const strongTopicSet = new Set<string>();
  const weakTopicSet = new Set<string>();

  history.forEach(item => {
    totalQuestions += item.attemptedQuestions;
    totalScoreSum += item.averageScore;
    if (item.averageScore > bestScore) bestScore = item.averageScore;

    const tech = item.config.technology;
    if (techStats[tech]) {
      const prevCount = techStats[tech].count;
      const prevAvg = techStats[tech].avgScore;
      const newCount = prevCount + 1;
      const newAvg = (prevAvg * prevCount + item.averageScore) / newCount;
      techStats[tech] = {
        count: newCount,
        avgScore: Number(newAvg.toFixed(1)),
      };
    }

    item.strongTopics.forEach(t => strongTopicSet.add(t));
    item.weakTopics.forEach(t => weakTopicSet.add(t));
  });

  const avgScore = Number((totalScoreSum / history.length).toFixed(1));

  return {
    totalInterviews: history.length,
    totalQuestionsAnswered: totalQuestions,
    averageScore: avgScore,
    bestScore: Number(bestScore.toFixed(1)),
    techStats,
    strongTopics: Array.from(strongTopicSet),
    weakTopics: Array.from(weakTopicSet),
    history,
    mcqHistory,
  };
}

export function getSavedProgress(): UserProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = calculateProgressFromHistory(INITIAL_SAMPLE_HISTORY, []);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    const parsed = JSON.parse(raw) as UserProgress;
    return parsed;
  } catch (err) {
    console.error('Failed to load user progress:', err);
    return calculateProgressFromHistory(INITIAL_SAMPLE_HISTORY, []);
  }
}

export function saveInterviewResult(result: InterviewResult): UserProgress {
  const current = getSavedProgress();
  const updatedHistory = [result, ...current.history];
  const updatedProgress = calculateProgressFromHistory(updatedHistory, current.mcqHistory);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProgress));
  } catch (err) {
    console.error('Failed to save interview result:', err);
  }
  return updatedProgress;
}

export function saveMCQAttempt(attempt: MCQAttempt): UserProgress {
  const current = getSavedProgress();
  const updatedMcq = [attempt, ...(current.mcqHistory || [])];
  const updatedProgress = {
    ...current,
    mcqHistory: updatedMcq,
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProgress));
  } catch (err) {
    console.error('Failed to save MCQ attempt:', err);
  }
  return updatedProgress;
}

export function clearAllProgress(): UserProgress {
  const emptyProgress: UserProgress = {
    totalInterviews: 0,
    totalQuestionsAnswered: 0,
    averageScore: 0,
    bestScore: 0,
    techStats: getDefaultTechStats(),
    strongTopics: [],
    weakTopics: [],
    history: [],
    mcqHistory: [],
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(emptyProgress));
  } catch (err) {
    console.error('Failed to clear progress:', err);
  }
  return emptyProgress;
}

export function resetToSampleData(): UserProgress {
  const sample = calculateProgressFromHistory(INITIAL_SAMPLE_HISTORY, []);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sample));
  } catch (err) {
    console.error('Failed to reset sample data:', err);
  }
  return sample;
}
