import { act, renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it } from "vitest";
import {
  StudySessionProvider,
  useStudySession,
} from "@/context/StudySessionContext";
import {
  STUDY_SESSION_STORAGE_KEY,
  saveStudySession,
} from "@/lib/study-session/storage";
import type { StudySession } from "@/lib/study-session/types";

const mockSession: StudySession = {
  id: "session-1",
  documentName: "sample.txt",
  documentType: "text",
  sourceText: "Sample notes content",
  createdAt: "2026-08-22T00:00:00.000Z",
  topics: null,
  summary: null,
  flashcards: null,
  quiz: null,
  quizAnswers: null,
  weakAreas: null,
  studyPlan: null,
};

function wrapper({ children }: { children: ReactNode }) {
  return <StudySessionProvider>{children}</StudySessionProvider>;
}

describe("StudySessionContext", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("throws an error when useStudySession is called outside of StudySessionProvider", () => {
    expect(() => renderHook(() => useStudySession())).toThrow(
      "useStudySession must be used within a StudySessionProvider"
    );
  });

  it("hydrates with null when localStorage is empty", () => {
    const { result } = renderHook(() => useStudySession(), { wrapper });

    expect(result.current.isHydrated).toBe(true);
    expect(result.current.session).toBeNull();
  });

  it("hydrates with stored session from localStorage on mount", () => {
    saveStudySession(mockSession);

    const { result } = renderHook(() => useStudySession(), { wrapper });

    expect(result.current.isHydrated).toBe(true);
    expect(result.current.session).toEqual(mockSession);
  });

  it("sets a new session and persists to localStorage", () => {
    const { result } = renderHook(() => useStudySession(), { wrapper });

    act(() => {
      result.current.setSession(mockSession);
    });

    expect(result.current.session).toEqual(mockSession);
    expect(window.localStorage.getItem(STUDY_SESSION_STORAGE_KEY)).not.toBeNull();
  });

  it("updates an existing session and persists changes to localStorage", () => {
    const { result } = renderHook(() => useStudySession(), { wrapper });

    act(() => {
      result.current.setSession(mockSession);
    });

    act(() => {
      result.current.updateSession({ summary: "Generated AI summary" });
    });

    expect(result.current.session?.summary).toBe("Generated AI summary");
    expect(result.current.session?.documentName).toBe("sample.txt");
  });

  it("clears the session from state and localStorage", () => {
    const { result } = renderHook(() => useStudySession(), { wrapper });

    act(() => {
      result.current.setSession(mockSession);
    });
    expect(result.current.session).not.toBeNull();

    act(() => {
      result.current.clearSession();
    });

    expect(result.current.session).toBeNull();
    expect(window.localStorage.getItem(STUDY_SESSION_STORAGE_KEY)).toBeNull();
  });
});
