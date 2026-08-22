"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStudySession } from "@/context/StudySessionContext";
import type { StudyTopic } from "@/lib/study-session/types";

interface StudyPackResponse {
  topics: StudyTopic[];
}

interface ErrorResponse {
  error: string;
}

export default function StudyPackPage() {
  const router = useRouter();

  const {
    session,
    isHydrated,
    updateSession,
  } = useStudySession();

  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    if (!session) {
      router.replace("/upload");
    }
  }, [isHydrated, session, router]);

  async function generateStudyPack() {
    if (!session || isGenerating) {
      return;
    }

    setIsGenerating(true);
    setError("");

    try {
      const response = await fetch("/api/study-pack", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sourceText: session.sourceText,
        }),
      });

      const data: StudyPackResponse | ErrorResponse =
        await response.json();

      if (!response.ok) {
        const message =
          "error" in data
            ? data.error
            : "Unable to generate your study pack.";

        throw new Error(message);
      }

      if (!("topics" in data)) {
        throw new Error("The study pack response was invalid.");
      }

      updateSession({
        topics: data.topics,
      });
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong while generating your study pack."
      );
    } finally {
      setIsGenerating(false);
    }
  }

  if (!isHydrated) {
    return (
      <div className="flex flex-1 items-center justify-center p-6">
        <p className="text-sm text-zinc-500">
          Loading your study session...
        </p>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const hasTopics =
    Array.isArray(session.topics) && session.topics.length > 0;

  // This guarantees that topics is always an array.
  const topics = session.topics ?? [];

  return (
    <div className="flex flex-1 flex-col p-6 md:p-12">
      <div className="mx-auto w-full max-w-3xl space-y-6">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-500">
            Your Study Pack
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            {session.documentName}
          </h1>

          <p className="mt-2 text-base text-zinc-600 dark:text-zinc-400">
            StudyFlow will analyze your material and organize it into the main
            topics you need to study.
          </p>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          {!hasTopics && !isGenerating && (
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                  Generate your Study Pack
                </h2>

                <p className="mt-1 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                  StudyFlow will analyze your uploaded notes and identify the
                  most important topics.
                </p>
              </div>

              <button
                type="button"
                onClick={generateStudyPack}
                className="inline-flex h-10 items-center justify-center rounded-md bg-zinc-900 px-5 text-sm font-medium text-white transition hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
              >
                Generate Study Pack →
              </button>
            </div>
          )}

          {isGenerating && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900 dark:border-zinc-700 dark:border-t-zinc-100" />

              <h2 className="mt-5 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                Analyzing your study material
              </h2>

              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                Identifying the most important topics...
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
                onClick={generateStudyPack}
                className="font-medium underline underline-offset-4"
              >
                Try again
              </button>
            </div>
          )}

          {hasTopics && !isGenerating && (
            <div>
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                  <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                    Generated Topics
                  </h2>

                  <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                    {topics.length} topics identified from your study material.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={generateStudyPack}
                  className="text-sm font-medium text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                >
                  Regenerate
                </button>
              </div>

              <div className="mt-6 space-y-3">
                {topics.map((topic, index) => (
                  <div
                    key={topic.id}
                    className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800"
                  >
                    <div className="flex gap-4">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-xs font-semibold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <div>
                        <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                          {topic.title}
                        </h3>

                        <p className="mt-1 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                          {topic.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {hasTopics && (
          <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Continue studying
            </h2>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Link
                href="/summary"
                className="rounded-lg border border-zinc-200 p-4 transition hover:border-zinc-400 dark:border-zinc-800"
              >
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                  Summary
                </h3>

                <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
                  Review the key concepts.
                </p>
              </Link>

              <Link
                href="/flashcards"
                className="rounded-lg border border-zinc-200 p-4 transition hover:border-zinc-400 dark:border-zinc-800"
              >
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                  Flashcards
                </h3>

                <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
                  Practice active recall.
                </p>
              </Link>

              <Link
                href="/quiz"
                className="rounded-lg border border-zinc-200 p-4 transition hover:border-zinc-400 dark:border-zinc-800"
              >
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                  Quiz
                </h3>

                <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
                  Test your understanding.
                </p>
              </Link>

              <Link
                href="/study-plan"
                className="rounded-lg border border-zinc-200 p-4 transition hover:border-zinc-400 dark:border-zinc-800"
              >
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                  Study Plan
                </h3>

                <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
                  Plan your next study sessions.
                </p>
              </Link>
            </div>
          </div>
        )}

        <div className="flex justify-between pt-4">
          <Link
            href="/upload"
            className="inline-flex h-10 items-center justify-center rounded-md border border-zinc-300 px-4 text-sm font-medium transition hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
          >
            ← Back to Upload
          </Link>

          {hasTopics && (
            <Link
              href="/summary"
              className="inline-flex h-10 items-center justify-center rounded-md bg-zinc-900 px-4 text-sm font-medium text-white transition hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
            >
              Next: Summary →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}