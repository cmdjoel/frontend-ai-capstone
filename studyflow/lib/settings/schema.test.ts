import { describe, expect, it } from "vitest";
import { isExamDateValid, settingsSchema } from "@/lib/settings/schema";

function formatLocalDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getTodayString(): string {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return formatLocalDate(date);
}

function getPastDateString(): string {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  date.setHours(0, 0, 0, 0);
  return formatLocalDate(date);
}

describe("settingsSchema", () => {
  const validSettings = {
    examDate: getTodayString(),
    studyHoursPerDay: 4,
    quizDifficulty: "Medium" as const,
    aiExplanationDetail: "Standard" as const,
  };

  it("accepts valid settings", () => {
    const result = settingsSchema.safeParse(validSettings);
    expect(result.success).toBe(true);
  });

  it("rejects an exam date before today", () => {
    const result = settingsSchema.safeParse({
      ...validSettings,
      examDate: getPastDateString(),
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.examDate).toContain(
        "Exam date cannot be before today",
      );
    }
  });

  it("rejects missing exam date", () => {
    const result = settingsSchema.safeParse({
      ...validSettings,
      examDate: "",
    });

    expect(result.success).toBe(false);
  });

  it("rejects study hours below 1", () => {
    const result = settingsSchema.safeParse({
      ...validSettings,
      studyHoursPerDay: 0,
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.studyHoursPerDay).toContain(
        "Study hours must be at least 1",
      );
    }
  });

  it("rejects study hours above 12", () => {
    const result = settingsSchema.safeParse({
      ...validSettings,
      studyHoursPerDay: 13,
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.studyHoursPerDay).toContain(
        "Study hours cannot exceed 12",
      );
    }
  });

  it("rejects empty quiz difficulty", () => {
    const result = settingsSchema.safeParse({
      ...validSettings,
      quizDifficulty: "",
    });

    expect(result.success).toBe(false);
  });

  it("rejects empty AI explanation detail", () => {
    const result = settingsSchema.safeParse({
      ...validSettings,
      aiExplanationDetail: "",
    });

    expect(result.success).toBe(false);
  });
});

describe("isExamDateValid", () => {
  const referenceDate = new Date("2026-08-07T00:00:00");

  it("returns true for today and future dates", () => {
    expect(isExamDateValid("2026-08-07", referenceDate)).toBe(true);
    expect(isExamDateValid("2026-09-01", referenceDate)).toBe(true);
  });

  it("returns false for past dates", () => {
    expect(isExamDateValid("2026-08-06", referenceDate)).toBe(false);
  });
});
