import type { StudySession } from "./types";

export const STUDY_SESSION_STORAGE_KEY = "studyflow-study-session";

function isValidStudySession(data: unknown): data is StudySession {
  if (!data || typeof data !== "object") {
    return false;
  }

  const candidate = data as Record<string, unknown>;

  return (
    typeof candidate.id === "string" &&
    typeof candidate.documentName === "string" &&
    (candidate.documentType === "text" || candidate.documentType === "pdf") &&
    typeof candidate.sourceText === "string" &&
    typeof candidate.createdAt === "string"
  );
}

export function loadStudySession(): StudySession | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(STUDY_SESSION_STORAGE_KEY);
    if (!raw) {
      return null;
    }

    const parsed: unknown = JSON.parse(raw);
    if (isValidStudySession(parsed)) {
      return parsed;
    }

    return null;
  } catch {
    return null;
  }
}

export function saveStudySession(session: StudySession): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(STUDY_SESSION_STORAGE_KEY, JSON.stringify(session));
  } catch {
    // Fail gracefully if localStorage quota is exceeded or storage is unavailable
  }
}

export function clearStudySession(): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.removeItem(STUDY_SESSION_STORAGE_KEY);
  } catch {
    // Fail gracefully
  }
}
