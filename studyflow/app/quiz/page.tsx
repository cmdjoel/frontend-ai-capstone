"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStudySession } from "@/context/StudySessionContext";
import type { QuizAnswer, QuizQuestion } from "@/lib/study-session/types";

interface QuizResponse {
  quiz: QuizQuestion[];
}

interface ErrorResponse {
  error: string;
}

export default function QuizPage() {
  const router = useRouter();
  const { session, isHydrated, updateSession } = useStudySession();

  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userSelections, setUserSelections] = useState<Record<string, number>>(
    {}
  );

  async function generateQuiz() {
    if (!session || isGenerating) {
      return;
    }

    setIsGenerating(true);
    setError("");

    try {
      const response = await fetch("/api/quiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sourceText: session.sourceText,
          topics: session.topics ?? undefined,
        }),
      });

      const data: QuizResponse | ErrorResponse = await response.json();

      if (!response.ok) {
        const message =
          "error" in data ? data.error : "Unable to generate your quiz.";
        throw new Error(message);
      }

      if (!("quiz" in data) || !Array.isArray(data.quiz)) {
        throw new Error("The quiz response was invalid.");
      }

      updateSession({
        quiz: data.quiz,
        quizAnswers: null,
      });
      setCurrentIndex(0);
      setUserSelections({});
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while generating your quiz."
      );
    } finally {
      setIsGenerating(false);
    }
  }

  function handleSelectOption(questionId: string, optionIndex: number) {
    setUserSelections((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  }

  function handlePrevious() {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  }

  function handleNext() {
    const total = session?.quiz?.length ?? 0;
    if (currentIndex < total - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  }

  function handleFinishQuiz() {
    const quiz = session?.quiz ?? [];
    if (quiz.length === 0) {
      return;
    }

    const completedAnswers: QuizAnswer[] = quiz.map((q) => {
      const selected = userSelections[q.id] ?? -1;
      return {
        questionId: q.id,
        selectedAnswer: selected,
        isCorrect: selected === q.correctAnswer,
      };
    });

    updateSession({
      quizAnswers: completedAnswers,
    });

    router.push("/quiz/results");
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

  const quiz = session.quiz ?? [];
  const hasQuiz = quiz.length > 0;
  const currentQuestion = hasQuiz ? quiz[currentIndex] : null;

  const currentTopic =
    currentQuestion?.topicId && session.topics
      ? session.topics.find((t) => t.id === currentQuestion.topicId)
      : null;

  const selectedAnswerIndex = currentQuestion
    ? userSelections[currentQuestion.id]
    : undefined;

  const isLastQuestion = currentIndex === quiz.length - 1;
  const answeredCount = Object.keys(userSelections).length;

  return (
    <div className="flex flex-1 flex-col p-6 md:p-12">
      <div className="mx-auto w-full max-w-3xl space-y-6">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-500">
            Practice Quiz
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            {session.documentName}
          </h1>
          <p className="mt-2 text-base text-zinc-600 dark:text-zinc-400">
            Test your comprehension with practice multiple-choice questions
            generated from your study notes.
          </p>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 md:p-8">
          {!hasQuiz && !isGenerating && (
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                  Generate your Practice Quiz
                </h2>
                <p className="mt-1 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                  StudyFlow will generate 5–10 challenging multiple-choice
                  questions to evaluate your understanding and identify weak
                  areas.
                </p>
                {session.topics && session.topics.length > 0 && (
                  <p className="mt-2 text-xs font-medium text-zinc-500">
                    ✓ Questions will cover key topics identified in your Study
                    Pack.
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={generateQuiz}
                className="inline-flex h-10 items-center justify-center rounded-md bg-zinc-900 px-5 text-sm font-medium text-white transition hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
              >
                Generate Quiz →
              </button>
            </div>
          )}

          {isGenerating && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900 dark:border-zinc-700 dark:border-t-zinc-100" />
              <h2 className="mt-5 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                Creating your practice quiz...
              </h2>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                Building questions from your study material...
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
                onClick={generateQuiz}
                className="font-medium underline underline-offset-4"
              >
                Try again
              </button>
            </div>
          )}

          {hasQuiz && !isGenerating && currentQuestion && (
            <div className="space-y-6">
              {/* Header: Progress indicator & Topic & Regenerate button */}
              <div className="flex flex-col justify-between gap-3 border-b border-zinc-200 pb-4 sm:flex-row sm:items-center dark:border-zinc-800">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center rounded-md bg-zinc-100 px-2.5 py-1 text-xs font-semibold text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
                    Question {currentIndex + 1} of {quiz.length}
                  </span>
                  {currentTopic && (
                    <span className="inline-flex items-center rounded-md bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
                      Topic: {currentTopic.title}
                    </span>
                  )}
                  <span className="text-xs text-zinc-500">
                    ({answeredCount} of {quiz.length} answered)
                  </span>
                </div>

                <button
                  type="button"
                  onClick={generateQuiz}
                  className="text-sm font-medium text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 self-start sm:self-auto"
                >
                  Regenerate Quiz
                </button>
              </div>

              {/* Question Text */}
              <div>
                <h2 className="text-lg font-semibold leading-relaxed text-zinc-900 dark:text-zinc-50 md:text-xl">
                  {currentQuestion.question}
                </h2>
              </div>

              {/* Options */}
              <div className="space-y-3">
                {currentQuestion.options.map((option, optionIdx) => {
                  const isSelected = selectedAnswerIndex === optionIdx;
                  return (
                    <button
                      key={optionIdx}
                      type="button"
                      onClick={() =>
                        handleSelectOption(currentQuestion.id, optionIdx)
                      }
                      className={`group flex w-full items-center gap-3.5 rounded-lg border p-4 text-left text-sm transition ${isSelected
                          ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900 shadow-sm"
                          : "border-zinc-200 bg-white text-zinc-800 hover:border-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:border-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                        }`}
                    >
                      <span
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${isSelected
                            ? "bg-white text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100"
                            : "bg-zinc-100 text-zinc-700 group-hover:bg-zinc-200 group-hover:text-zinc-900 dark:bg-zinc-800 dark:text-zinc-300 dark:group-hover:bg-zinc-700 dark:group-hover:text-zinc-100"
                          }`}
                      >
                        {String.fromCharCode(65 + optionIdx)}
                      </span>
                      <span className="leading-snug">{option}</span>
                    </button>
                  );
                })}
              </div>

              {/* Navigation buttons: Previous, Next / Finish */}
              <div className="flex items-center justify-between border-t border-zinc-200 pt-6 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={handlePrevious}
                  disabled={currentIndex === 0}
                  className="inline-flex h-10 items-center justify-center rounded-md border border-zinc-300 px-4 text-sm font-medium transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-zinc-700 dark:hover:bg-zinc-800"
                >
                  ← Previous
                </button>

                <div className="text-xs text-zinc-500">
                  Question {currentIndex + 1} of {quiz.length}
                </div>

                {isLastQuestion ? (
                  <button
                    type="button"
                    onClick={handleFinishQuiz}
                    className="inline-flex h-10 items-center justify-center rounded-md bg-emerald-600 px-5 text-sm font-medium text-white transition hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:bg-emerald-600 dark:hover:bg-emerald-500"
                  >
                    Finish Quiz →
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="inline-flex h-10 items-center justify-center rounded-md bg-zinc-900 px-4 text-sm font-medium text-white transition hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
                  >
                    Next →
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Global Flow Navigation */}
        <div className="flex justify-between pt-4">
          <Link
            href="/flashcards"
            className="inline-flex h-10 items-center justify-center rounded-md border border-zinc-300 px-4 text-sm font-medium transition hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
          >
            ← Back to Flashcards
          </Link>

          {session.quizAnswers && session.quizAnswers.length > 0 && (
            <Link
              href="/quiz/results"
              className="inline-flex h-10 items-center justify-center rounded-md bg-zinc-900 px-4 text-sm font-medium text-white transition hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
            >
              View Results →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
