export type Technology = 
  | 'Java' 
  | 'Python' 
  | 'C' 
  | 'C++' 
  | 'JavaScript' 
  | 'HTML/CSS' 
  | 'React JS';

export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export type InterviewType = 'Technical' | 'MCQ';

export type QuestionCount = 5 | 10 | 15;

export interface InterviewConfig {
  technology: Technology;
  difficulty: Difficulty;
  questionCount: QuestionCount;
  interviewType: InterviewType;
}

export interface Question {
  id: string;
  tech: Technology;
  difficulty: Difficulty;
  text: string;
  codeSnippet?: string;
  topic: string;
  hint?: string;
  sampleAnswer?: string;
}

export interface AnswerEvaluation {
  score: number; // 0 to 10
  scoreOutOf10: number;
  correctPoints: string[];
  missingPoints: string[];
  suggestions: string[];
  modelAnswer: string;
  difficulty: Difficulty;
  topic: string;
}

export interface ChatMessage {
  id: string;
  sender: 'interviewer' | 'user' | 'system';
  text: string;
  codeSnippet?: string;
  timestamp: string;
  evaluation?: AnswerEvaluation;
  questionId?: string;
  questionIndex?: number;
  isQuestion?: boolean;
}

export interface InterviewResult {
  id: string;
  timestamp: string;
  config: InterviewConfig;
  messages: ChatMessage[];
  totalQuestions: number;
  attemptedQuestions: number;
  averageScore: number;
  percentage: number;
  strongTopics: string[];
  weakTopics: string[];
  overallFeedback: string;
  keyTakeaways: string[];
}

export interface MCQQuestion {
  id: string;
  tech: Technology;
  difficulty: Difficulty;
  topic: string;
  question: string;
  codeSnippet?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface MCQAttempt {
  id: string;
  timestamp: string;
  tech: Technology;
  difficulty: Difficulty;
  score: number;
  total: number;
  percentage: number;
  answers: {
    questionId: string;
    questionText: string;
    selectedIndex: number;
    correctIndex: number;
    isCorrect: boolean;
    explanation: string;
  }[];
}

export interface UserProgress {
  totalInterviews: number;
  totalQuestionsAnswered: number;
  averageScore: number;
  bestScore: number;
  techStats: Record<Technology, { count: number; avgScore: number }>;
  strongTopics: string[];
  weakTopics: string[];
  history: InterviewResult[];
  mcqHistory: MCQAttempt[];
}
