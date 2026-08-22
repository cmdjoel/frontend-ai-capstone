export interface StudyTopic {
  id: string;
  title: string;
  description?: string;
}

export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  topicId?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  topicId?: string;
}

export interface QuizAnswer {
  questionId: string;
  selectedAnswer: number;
  isCorrect: boolean;
}

export interface StudyPlanSession {
  id: string;
  title: string;
  focus: string;
  tasks: string[];
  duration: string;
  priority: "high" | "medium" | "low";
}

export interface StudySession {
  id: string;
  documentName: string;
  documentType: "text" | "pdf";
  sourceText: string;
  createdAt: string;
  topics: StudyTopic[] | null;
  summary: string | null;
  flashcards: Flashcard[] | null;
  quiz: QuizQuestion[] | null;
  quizAnswers: QuizAnswer[] | null;
  weakAreas: string[] | null;
  studyPlan: StudyPlanSession[] | null;
}
