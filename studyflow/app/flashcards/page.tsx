"use client";

import { useState } from "react";
import Link from "next/link";
import { useStudySession } from "@/context/StudySessionContext";
import type { Flashcard } from "@/lib/study-session/types";

interface FlashcardsResponse {
  flashcards: Flashcard[];
}

interface ErrorResponse {
  error: string;
}

export default function FlashcardsPage() {
  const { session, isHydrated, updateSession } = useStudySession();

  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);

  async function generateFlashcards() {
    if (!session || isGenerating) {
      return;
    }

    setIsGenerating(true);
    setError("");

    try {
      const response = await fetch("/api/flashcards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sourceText: session.sourceText,
          topics: session.topics ?? undefined,
        }),
      });

      const data: FlashcardsResponse | ErrorResponse = await response.json();

      if (!response.ok) {
        const message =
          "error" in data
            ? data.error
            : "Unable to generate your flashcards.";
        throw new Error(message);
      }

      if (!("flashcards" in data) || !Array.isArray(data.flashcards)) {
        throw new Error("The flashcards response was invalid.");
      }

      updateSession({
        flashcards: data.flashcards,
      });
      setCurrentIndex(0);
      setIsAnswerRevealed(false);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while generating your flashcards."
      );
    } finally {
      setIsGenerating(false);
    }
  }

  function handlePrevious() {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setIsAnswerRevealed(false);
    }
  }

  function handleNext() {
    const total = session?.flashcards?.length ?? 0;
    if (currentIndex < total - 1) {
      setCurrentIndex((prev) => prev + 1);
      setIsAnswerRevealed(false);
    }
  }

  function toggleAnswer() {
    setIsAnswerRevealed((prev) => !prev);
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

  const flashcards = session.flashcards ?? [];
  const hasFlashcards = flashcards.length > 0;
  const currentCard = hasFlashcards ? flashcards[currentIndex] : null;

  // Find associated topic title if available
  const currentTopic =
    currentCard?.topicId && session.topics
      ? session.topics.find((t) => t.id === currentCard.topicId)
      : null;

  return (
    <div className="flex flex-1 flex-col p-6 md:p-12">
      <div className="mx-auto w-full max-w-3xl space-y-6">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-500">
            Interactive Flashcards
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            {session.documentName}
          </h1>
          <p className="mt-2 text-base text-zinc-600 dark:text-zinc-400">
            Test and strengthen active recall across core concepts, definitions,
            and key terminology.
          </p>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 md:p-8">
          {!hasFlashcards && !isGenerating && (
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                  Generate your Flashcards
                </h2>
                <p className="mt-1 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                  StudyFlow will generate interactive active-recall flashcards
                  tailored to your study material.
                </p>
                {session.topics && session.topics.length > 0 && (
                  <p className="mt-2 text-xs font-medium text-zinc-500">
                    ✓ Will cover all {session.topics.length} topics identified
                    in your Study Pack.
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={generateFlashcards}
                className="inline-flex h-10 items-center justify-center rounded-md bg-zinc-900 px-5 text-sm font-medium text-white transition hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
              >
                Generate Flashcards →
              </button>
            </div>
          )}

          {isGenerating && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900 dark:border-zinc-700 dark:border-t-zinc-100" />
              <h2 className="mt-5 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                Generating your flashcards...
              </h2>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                Creating active recall questions from your study material...
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
                onClick={generateFlashcards}
                className="font-medium underline underline-offset-4"
              >
                Try again
              </button>
            </div>
          )}

          {hasFlashcards && !isGenerating && currentCard && (
            <div className="space-y-6">
              {/* Header: Progress indicator & Topic & Regenerate button */}
              <div className="flex flex-col justify-between gap-3 border-b border-zinc-200 pb-4 sm:flex-row sm:items-center dark:border-zinc-800">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center rounded-md bg-zinc-100 px-2.5 py-1 text-xs font-semibold text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
                    Card {currentIndex + 1} of {flashcards.length}
                  </span>
                  {currentTopic && (
                    <span className="inline-flex items-center rounded-md bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
                      Topic: {currentTopic.title}
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={generateFlashcards}
                  className="text-sm font-medium text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 self-start sm:self-auto"
                >
                  Regenerate Flashcards
                </button>
              </div>

              {/* Main Card View */}
              <div className="flex min-h-64 flex-col justify-between rounded-xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-950/50 md:p-8">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                    Question
                  </span>
                  <p className="mt-2 text-lg font-semibold leading-relaxed text-zinc-900 dark:text-zinc-50 md:text-xl">
                    {currentCard.question}
                  </p>
                </div>

                {/* Answer Area */}
                <div className="mt-6 border-t border-zinc-200 pt-6 dark:border-zinc-800">
                  {isAnswerRevealed ? (
                    <div className="space-y-3">
                      <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                        Answer
                      </span>
                      <p className="text-base leading-relaxed text-zinc-800 dark:text-zinc-200">
                        {currentCard.answer}
                      </p>
                      <button
                        type="button"
                        onClick={toggleAnswer}
                        className="text-xs font-medium text-zinc-500 underline underline-offset-4 hover:text-zinc-800 dark:hover:text-zinc-200"
                      >
                        Hide Answer
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={toggleAnswer}
                      className="inline-flex h-10 w-full items-center justify-center rounded-md border border-zinc-300 bg-white px-4 text-sm font-medium text-zinc-900 shadow-sm transition hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800 sm:w-auto"
                    >
                      Show Answer
                    </button>
                  )}
                </div>
              </div>

              {/* Navigation Controls: Previous / Next */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={handlePrevious}
                  disabled={currentIndex === 0}
                  className="inline-flex h-10 items-center justify-center rounded-md border border-zinc-300 px-4 text-sm font-medium transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-zinc-700 dark:hover:bg-zinc-800"
                >
                  ← Previous
                </button>

                <div className="text-xs text-zinc-500">
                  {currentIndex + 1} / {flashcards.length}
                </div>

                <button
                  type="button"
                  onClick={handleNext}
                  disabled={currentIndex === flashcards.length - 1}
                  className="inline-flex h-10 items-center justify-center rounded-md bg-zinc-900 px-4 text-sm font-medium text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
                >
                  Next →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Global Flow Navigation: Back to Summary / Next: Quiz */}
        <div className="flex justify-between pt-4">
          <Link
            href="/summary"
            className="inline-flex h-10 items-center justify-center rounded-md border border-zinc-300 px-4 text-sm font-medium transition hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
          >
            ← Back to Summary
          </Link>

          {hasFlashcards && (
            <Link
              href="/quiz"
              className="inline-flex h-10 items-center justify-center rounded-md bg-zinc-900 px-4 text-sm font-medium text-white transition hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
            >
              Next: Quiz →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
