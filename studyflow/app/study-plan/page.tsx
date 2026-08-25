"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStudySession } from "@/context/StudySessionContext";
import { loadSettingsFromStorage } from "@/lib/settings/storage";
import type { StudyPlanSession } from "@/lib/study-session/types";

interface StudyPlanResponse {
  studyPlan: StudyPlanSession[];
}

interface ErrorResponse {
  error: string;
}

export default function StudyPlanPage() {
  const router = useRouter();
  const { session, isHydrated, updateSession, clearSession } =
    useStudySession();

  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");

  async function generateStudyPlan() {
    if (!session || isGenerating) {
      return;
    }

    setIsGenerating(true);
    setError("");

    try {
      const savedSettings = loadSettingsFromStorage();
      const response = await fetch("/api/study-plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sourceText: session.sourceText,
          topics: session.topics ?? undefined,
          weakAreas: session.weakAreas ?? undefined,
          studyHoursPerDay: savedSettings?.studyHoursPerDay,
          examDate: savedSettings?.examDate || undefined,
        }),
      });

      const data: StudyPlanResponse | ErrorResponse = await response.json();

      if (!response.ok) {
        const message =
          "error" in data ? data.error : "Unable to generate your study plan.";
        throw new Error(message);
      }

      if (!("studyPlan" in data) || !Array.isArray(data.studyPlan)) {
        throw new Error("The study plan response was invalid.");
      }

      updateSession({
        studyPlan: data.studyPlan,
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while generating your study plan."
      );
    } finally {
      setIsGenerating(false);
    }
  }

  function handleStartNewSession() {
    const confirmed = window.confirm(
      "Are you sure you want to start a new study session? This will clear your current notes and progress."
    );
    if (confirmed) {
      clearSession();
      router.push("/upload");
    }
  }

  if (!isHydrated) {
    return (
      <div className="flex flex-1 items-center justify-center p-6">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">Loading your study session...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex flex-1 flex-col p-6 md:p-12">
        <div className="mx-auto w-full max-w-3xl space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              No Study Session Found
            </h1>
            <p className="mt-2 text-base text-zinc-600 dark:text-zinc-400">
              You haven&apos;t uploaded any study material yet. Create a study
              session by uploading or pasting your lecture notes first.
            </p>
          </div>
          <div className="pt-2">
            <Link
              href="/upload"
              className="inline-flex h-10 items-center justify-center rounded-md bg-zinc-900 px-5 text-sm font-medium text-white transition hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
            >
              ← Go to Upload Notes
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const studyPlan = session.studyPlan ?? [];
  const hasStudyPlan = studyPlan.length > 0;
  const weakAreas = session.weakAreas ?? [];

  return (
    <div className="flex flex-1 flex-col p-6 md:p-12">
      <div className="mx-auto w-full max-w-3xl space-y-6">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-600 dark:text-zinc-400">
            Personalized Roadmap
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Custom Study Plan
          </h1>
          <p className="mt-2 text-base text-zinc-600 dark:text-zinc-400">
            A targeted, milestone-based learning schedule prioritizing concepts
            where you need the most reinforcement.
          </p>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 md:p-8">
          {!hasStudyPlan && !isGenerating && (
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                  Generate your Personalized Study Plan
                </h2>
                <p className="mt-1 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                  StudyFlow will design a structured daily study schedule based
                  on your notes, active flashcards, and identified quiz weak
                  areas.
                </p>

                {weakAreas.length > 0 && (
                  <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50/60 p-3 text-xs text-amber-900 dark:border-amber-950 dark:bg-amber-950/30 dark:text-amber-300">
                    🎯 <strong>Prioritizing:</strong> {weakAreas.join(", ")}
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={generateStudyPlan}
                className="inline-flex h-10 items-center justify-center rounded-md bg-zinc-900 px-5 text-sm font-medium text-white transition hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
              >
                Generate Personalized Study Plan →
              </button>
            </div>
          )}

          {isGenerating && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900 dark:border-zinc-700 dark:border-t-zinc-100" />
              <h2 className="mt-5 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                Building your personalized study plan...
              </h2>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                Prioritizing topics that need more attention and structuring
                daily tasks...
              </p>
            </div>
          )}

          {error && !isGenerating && (
            <div
              role="alert"
              className="space-y-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-400"
            >
              <p>{error}</p>
              <button
                type="button"
                onClick={generateStudyPlan}
                className="font-medium underline underline-offset-4"
              >
                Try again
              </button>
            </div>
          )}

          {hasStudyPlan && !isGenerating && (
            <div className="space-y-6">
              <div className="flex flex-col justify-between gap-3 border-b border-zinc-200 pb-4 sm:flex-row sm:items-center dark:border-zinc-800">
                <div>
                  <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                    Daily Study Milestones
                  </h2>
                  <p className="mt-0.5 text-xs text-zinc-600 dark:text-zinc-400">
                    {studyPlan.length}-session strategic learning roadmap for{" "}
                    {session.documentName}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={generateStudyPlan}
                  className="text-sm font-medium text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 self-start sm:self-auto"
                >
                  Regenerate Study Plan
                </button>
              </div>

              {/* Milestones List */}
              <div className="space-y-4">
                {studyPlan.map((planSession, idx) => {
                  let badgeColor =
                    "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200";

                  if (planSession.priority === "high") {
                    badgeColor =
                      "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300";
                  } else if (planSession.priority === "medium") {
                    badgeColor =
                      "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300";
                  }

                  return (
                    <div
                      key={planSession.id || idx}
                      className="rounded-xl border border-zinc-200 bg-zinc-50/60 p-5 dark:border-zinc-800 dark:bg-zinc-950/40"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-200/80 pb-3 dark:border-zinc-800/80">
                        <div className="flex items-center gap-2.5">
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-xs font-bold text-white dark:bg-zinc-100 dark:text-zinc-900">
                            {idx + 1}
                          </span>
                          <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">
                            {planSession.title}
                          </h3>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">
                            ⏱️ {planSession.duration}
                          </span>
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider ${badgeColor}`}
                          >
                            {planSession.priority} Priority
                          </span>
                        </div>
                      </div>

                      <div className="mt-3 space-y-2">
                        <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                          <strong>Focus Area:</strong> {planSession.focus}
                        </p>

                        <div className="space-y-1 pt-1">
                          <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                            Recommended Action Tasks:
                          </span>
                          <ul className="space-y-1 pl-4 text-xs text-zinc-700 dark:text-zinc-300 list-disc">
                            {planSession.tasks.map((task, taskIdx) => (
                              <li key={taskIdx}>{task}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Global Bottom Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4">
          <Link
            href="/weak-areas"
            className="inline-flex h-10 items-center justify-center rounded-md border border-zinc-300 px-4 text-sm font-medium transition hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
          >
            ← Back to Weak Areas
          </Link>

          <button
            type="button"
            onClick={handleStartNewSession}
            className="inline-flex h-10 items-center justify-center rounded-md border border-zinc-300 bg-white px-4 text-sm font-medium text-zinc-700 shadow-sm transition hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
          >
            Start New Study Session ⟳
          </button>
        </div>
      </div>
    </div>
  );
}
