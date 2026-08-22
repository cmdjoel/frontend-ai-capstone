"use client";

import { useState } from "react";
import Link from "next/link";
import { useStudySession } from "@/context/StudySessionContext";
import { MarkdownContent } from "@/components/chat/MarkdownContent";

interface SummaryResponse {
  summary: string;
}

interface ErrorResponse {
  error: string;
}

export default function SummaryPage() {
  const { session, isHydrated, updateSession } = useStudySession();

  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");

  async function generateSummary() {
    if (!session || isGenerating) {
      return;
    }

    setIsGenerating(true);
    setError("");

    try {
      const response = await fetch("/api/summary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sourceText: session.sourceText,
          topics: session.topics ?? undefined,
        }),
      });

      const data: SummaryResponse | ErrorResponse = await response.json();

      if (!response.ok) {
        const message =
          "error" in data
            ? data.error
            : "Unable to generate your study summary.";
        throw new Error(message);
      }

      if (!("summary" in data) || typeof data.summary !== "string") {
        throw new Error("The summary response was invalid.");
      }

      updateSession({
        summary: data.summary,
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while generating your summary."
      );
    } finally {
      setIsGenerating(false);
    }
  }

  if (!isHydrated) {
    return (
      <div className="flex flex-1 items-center justify-center p-6">
        <p className="text-sm text-zinc-500">Loading your study session...</p>
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

  const hasSummary = Boolean(session.summary && session.summary.trim().length > 0);
  const hasTopics = Array.isArray(session.topics) && session.topics.length > 0;

  return (
    <div className="flex flex-1 flex-col p-6 md:p-12">
      <div className="mx-auto w-full max-w-3xl space-y-6">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-500">
            Study Summary
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            {session.documentName}
          </h1>
          <p className="mt-2 text-base text-zinc-600 dark:text-zinc-400">
            AI-synthesized topic breakdown, key definitions, and core concepts
            extracted from your study material.
          </p>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 md:p-8">
          {!hasSummary && !isGenerating && (
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                  Generate your Study Summary
                </h2>
                <p className="mt-1 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                  StudyFlow will synthesize key concepts, definitions, and
                  takeaways from your notes for active recall and revision.
                </p>
                {hasTopics && (
                  <p className="mt-2 text-xs font-medium text-zinc-500">
                    ✓ Will align with the {session.topics?.length} topics
                    identified in your Study Pack.
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={generateSummary}
                className="inline-flex h-10 items-center justify-center rounded-md bg-zinc-900 px-5 text-sm font-medium text-white transition hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
              >
                Generate Summary →
              </button>
            </div>
          )}

          {isGenerating && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900 dark:border-zinc-700 dark:border-t-zinc-100" />
              <h2 className="mt-5 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                Generating your study summary
              </h2>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                Synthesizing key concepts, definitions, and takeaways...
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
                onClick={generateSummary}
                className="font-medium underline underline-offset-4"
              >
                Try again
              </button>
            </div>
          )}

          {hasSummary && !isGenerating && (
            <div>
              <div className="flex flex-col justify-between gap-3 border-b border-zinc-200 pb-4 sm:flex-row sm:items-center dark:border-zinc-800">
                <div>
                  <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                    Comprehensive Summary
                  </h2>
                  <p className="mt-0.5 text-xs text-zinc-500">
                    Generated from your study material
                  </p>
                </div>
                <button
                  type="button"
                  onClick={generateSummary}
                  className="text-sm font-medium text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 self-start sm:self-auto"
                >
                  Regenerate Summary
                </button>
              </div>

              <div className="mt-6">
                <MarkdownContent content={session.summary ?? ""} />
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between pt-4">
          <Link
            href="/study-pack"
            className="inline-flex h-10 items-center justify-center rounded-md border border-zinc-300 px-4 text-sm font-medium transition hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
          >
            ← Back to Study Pack
          </Link>

          {hasSummary && (
            <Link
              href="/flashcards"
              className="inline-flex h-10 items-center justify-center rounded-md bg-zinc-900 px-4 text-sm font-medium text-white transition hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
            >
              Next: Flashcards →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
