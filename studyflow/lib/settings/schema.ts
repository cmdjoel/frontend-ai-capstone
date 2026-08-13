import { z } from "zod";

export const QUIZ_DIFFICULTY_OPTIONS = ["Easy", "Medium", "Hard"] as const;
export const AI_EXPLANATION_OPTIONS = ["Brief", "Standard", "Detailed"] as const;

export type QuizDifficulty = (typeof QUIZ_DIFFICULTY_OPTIONS)[number];
export type AiExplanationDetail = (typeof AI_EXPLANATION_OPTIONS)[number];

function startOfToday(): Date {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

export function isExamDateValid(examDate: string, referenceDate = startOfToday()): boolean {
  const parsed = new Date(examDate);
  if (Number.isNaN(parsed.getTime())) {
    return false;
  }
  parsed.setHours(0, 0, 0, 0);
  return parsed >= referenceDate;
}

export const settingsSchema = z.object({
  examDate: z
    .string()
    .min(1, "Exam date is required")
    .refine((value) => isExamDateValid(value), {
      message: "Exam date cannot be before today",
    }),
  studyHoursPerDay: z.coerce
    .number({
      invalid_type_error: "Study hours per day is required",
      required_error: "Study hours per day is required",
    })
    .min(1, "Study hours must be at least 1")
    .max(12, "Study hours cannot exceed 12"),
  quizDifficulty: z.enum(QUIZ_DIFFICULTY_OPTIONS, {
    errorMap: () => ({ message: "Preferred quiz difficulty is required" }),
  }),
  aiExplanationDetail: z.enum(AI_EXPLANATION_OPTIONS, {
    errorMap: () => ({ message: "AI explanation detail is required" }),
  }),
});

export type SettingsFormValues = z.infer<typeof settingsSchema>;

export const defaultSettingsValues: SettingsFormValues = {
  examDate: "",
  studyHoursPerDay: 1,
  quizDifficulty: "Medium",
  aiExplanationDetail: "Standard",
};
