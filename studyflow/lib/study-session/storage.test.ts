import { beforeEach, describe, expect, it } from "vitest";
import {
  STUDY_SESSION_STORAGE_KEY,
  clearStudySession,
  loadStudySession,
  saveStudySession,
} from "./storage";
import type { StudySession } from "./types";

const mockSession: StudySession = {
  id: "test-session-123",
  documentName: "intro-to-algorithms.txt",
  documentType: "text",
  sourceText: "Binary search runs in O(log n) time.",
  createdAt: new Date().toISOString(),
  topics: [{ id: "t1", title: "Algorithms", description: "Search algorithms" }],
  summary: "Brief overview of search algorithms.",
  flashcards: [{ id: "f1", question: "What is binary search complexity?", answer: "O(log n)" }],
  quiz: [
    {
      id: "q1",
      question: "What is the time complexity of binary search?",
      options: ["O(1)", "O(log n)", "O(n)", "O(n^2)"],
      correctAnswer: 1,
    },
  ],
  quizAnswers: [{ questionId: "q1", selectedAnswer: 1, isCorrect: true }],
  weakAreas: [],
  studyPlan: "Review binary search trees tomorrow.",
};

describe("study session storage", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("returns null when no study session is saved", () => {
    expect(loadStudySession()).toBeNull();
  });

  it("saves and loads a valid study session", () => {
    saveStudySession(mockSession);

    expect(window.localStorage.getItem(STUDY_SESSION_STORAGE_KEY)).not.toBeNull();
    expect(loadStudySession()).toEqual(mockSession);
  });

  it("clears a stored study session", () => {
    saveStudySession(mockSession);
    expect(loadStudySession()).toEqual(mockSession);

    clearStudySession();
    expect(loadStudySession()).toBeNull();
    expect(window.localStorage.getItem(STUDY_SESSION_STORAGE_KEY)).toBeNull();
  });

  it("returns null for invalid or corrupted stored JSON", () => {
    window.localStorage.setItem(STUDY_SESSION_STORAGE_KEY, "{ bad json");
    expect(loadStudySession()).toBeNull();
  });

  it("returns null when required session properties are missing", () => {
    window.localStorage.setItem(
      STUDY_SESSION_STORAGE_KEY,
      JSON.stringify({ documentName: "incomplete" })
    );
    expect(loadStudySession()).toBeNull();
  });
});
