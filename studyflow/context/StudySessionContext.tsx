"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  clearStudySession as clearStoredSession,
  loadStudySession,
  saveStudySession as saveStoredSession,
} from "@/lib/study-session/storage";
import type { StudySession } from "@/lib/study-session/types";

export interface StudySessionContextValue {
  session: StudySession | null;
  isHydrated: boolean;
  setSession: (session: StudySession | null) => void;
  updateSession: (patch: Partial<StudySession>) => void;
  clearSession: () => void;
}

const StudySessionContext = createContext<StudySessionContextValue | undefined>(
  undefined
);

export function StudySessionProvider({ children }: { children: ReactNode }) {
  const [session, setSessionState] = useState<StudySession | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const loaded = loadStudySession();
    if (loaded) {
      setSessionState(loaded);
    }
    setIsHydrated(true);
  }, []);

  const setSession = useCallback((newSession: StudySession | null) => {
    if (newSession) {
      saveStoredSession(newSession);
      setSessionState(newSession);
    } else {
      clearStoredSession();
      setSessionState(null);
    }
  }, []);

  const updateSession = useCallback((patch: Partial<StudySession>) => {
    setSessionState((prev) => {
      if (!prev) {
        return null;
      }
      const updated: StudySession = { ...prev, ...patch };
      saveStoredSession(updated);
      return updated;
    });
  }, []);

  const clearSession = useCallback(() => {
    clearStoredSession();
    setSessionState(null);
  }, []);

  return (
    <StudySessionContext.Provider
      value={{
        session,
        isHydrated,
        setSession,
        updateSession,
        clearSession,
      }}
    >
      {children}
    </StudySessionContext.Provider>
  );
}

export function useStudySession(): StudySessionContextValue {
  const context = useContext(StudySessionContext);
  if (!context) {
    throw new Error("useStudySession must be used within a StudySessionProvider");
  }
  return context;
}
