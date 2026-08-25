"use client";

import Link from "next/link";
import { useStudySession } from "@/context/StudySessionContext";

export default function QuizResultsPage() {
  const { session, isHydrated } = useStudySession();

  if (!isHydrated) {
    return (
      <div className="flex flex-1 items-center justify-center p-6">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">Loading your quiz results...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex flex-1 flex-col p-6 md:p-12">
        <div className="mx-auto w-full max-w-3xl space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              No Quiz Results Found
            </h1>
            <p className="mt-2 text-base text-zinc-600 dark:text-zinc-400">
              You haven&apos;t completed a quiz for this study session yet. Take
              the practice quiz to assess your understanding.
            </p>
          </div>
          <div className="pt-2">
            <Link
              href="/quiz"
              className="inline-flex h-10 items-center justify-center rounded-md bg-zinc-900 px-5 text-sm font-medium text-white transition hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
            >
              ← Go to Quiz
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const quiz = session.quiz ?? [];
  const answers = session.quizAnswers ?? [];
  const hasCompletedQuiz = quiz.length > 0 && answers.length > 0;

  if (!hasCompletedQuiz) {
    return (
      <div className="flex flex-1 flex-col p-6 md:p-12">
        <div className="mx-auto w-full max-w-3xl space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              No Completed Quiz Found
            </h1>
            <p className="mt-2 text-base text-zinc-600 dark:text-zinc-400">
              You have not completed a practice quiz for this study session yet.
              Take the quiz to evaluate your understanding and review detailed
              results.
            </p>
          </div>
          <div className="pt-2">
            <Link
              href="/quiz"
              className="inline-flex h-10 items-center justify-center rounded-md bg-zinc-900 px-5 text-sm font-medium text-white transition hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
            >
              ← Go to Quiz
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const totalQuestions = quiz.length;
  const correctCount = answers.filter((a) => a.isCorrect).length;
  const incorrectCount = totalQuestions - correctCount;
  const percentage = Math.round((correctCount / totalQuestions) * 100);

  let feedbackMessage = "Keep practicing!";
  let badgeColor =
    "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300";

  if (percentage >= 90) {
    feedbackMessage = "Excellent work! Outstanding grasp of the material.";
    badgeColor =
      "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300";
  } else if (percentage >= 70) {
    feedbackMessage = "Good progress! Solid understanding of core concepts.";
    badgeColor =
      "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300";
  } else if (percentage >= 50) {
    feedbackMessage = "Keep practicing! Review your weak topics to improve.";
    badgeColor =
      "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300";
  } else {
    feedbackMessage =
      "Let's review the difficult topics with focused study drills.";
    badgeColor = "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300";
  }

  return (
    <div className="flex flex-1 flex-col p-6 md:p-12">
      <div className="mx-auto w-full max-w-3xl space-y-6">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-600 dark:text-zinc-400">
            Assessment Results
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Quiz Performance
          </h1>
          <p className="mt-2 text-base text-zinc-600 dark:text-zinc-400">
            {session.documentName}
          </p>
        </div>

        {/* Score Summary Card */}
        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 md:p-8">
          <div className="flex flex-col justify-between gap-4 border-b border-zinc-200 pb-6 sm:flex-row sm:items-center dark:border-zinc-800">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                Overall Score
              </span>
              <div className="mt-1 flex items-baseline gap-3">
                <p className="text-4xl font-extrabold text-zinc-900 dark:text-zinc-50">
                  {percentage}%
                </p>
                <span className="text-sm text-zinc-600 dark:text-zinc-400">
                  ({correctCount} of {totalQuestions} correct)
                </span>
              </div>
            </div>

            <span
              className={`inline-flex items-center self-start rounded-full px-3.5 py-1.5 text-xs font-semibold sm:self-auto ${badgeColor}`}
            >
              {percentage >= 70 ? "Passed" : "Needs Review"}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-6 sm:grid-cols-3">
            <div className="rounded-lg border border-zinc-100 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950">
              <span className="text-xs text-zinc-600 dark:text-zinc-400">Correct Answers</span>
              <p className="mt-1 text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {correctCount}
              </p>
            </div>
            <div className="rounded-lg border border-zinc-100 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950">
              <span className="text-xs text-zinc-600 dark:text-zinc-400">Incorrect Answers</span>
              <p className="mt-1 text-2xl font-bold text-red-600 dark:text-red-400">
                {incorrectCount}
              </p>
            </div>
            <div className="col-span-2 rounded-lg border border-zinc-100 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950 sm:col-span-1">
              <span className="text-xs text-zinc-600 dark:text-zinc-400">Total Questions</span>
              <p className="mt-1 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                {totalQuestions}
              </p>
            </div>
          </div>

          <p className="mt-6 text-sm text-zinc-600 dark:text-zinc-400">
            {feedbackMessage}
          </p>
        </div>

        {/* Detailed Question Review */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
            Question-by-Question Review
          </h2>

          <div className="space-y-4">
            {quiz.map((q, idx) => {
              const answerObj = answers.find((a) => a.questionId === q.id);
              const selectedIdx = answerObj?.selectedAnswer ?? -1;
              const isCorrect = answerObj?.isCorrect ?? false;
              const topic =
                q.topicId && session.topics
                  ? session.topics.find((t) => t.id === q.topicId)
                  : null;

              return (
                <div
                  key={q.id}
                  className={`rounded-xl border p-6 transition ${
                    isCorrect
                      ? "border-emerald-200 bg-white dark:border-emerald-950 dark:bg-zinc-900"
                      : "border-red-200 bg-white dark:border-red-950 dark:bg-zinc-900"
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-100 pb-3 dark:border-zinc-800">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                        Question {idx + 1}
                      </span>
                      {topic && (
                        <span className="inline-flex items-center rounded-md bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                          {topic.title}
                        </span>
                      )}
                    </div>

                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        isCorrect
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                          : "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300"
                      }`}
                    >
                      {isCorrect ? "✓ Correct" : "✕ Incorrect"}
                    </span>
                  </div>

                  <p className="mt-3 text-base font-semibold text-zinc-900 dark:text-zinc-50">
                    {q.question}
                  </p>

                  <div className="mt-4 space-y-2">
                    {q.options.map((opt, optIdx) => {
                      const isUserChoice = selectedIdx === optIdx;
                      const isCorrectChoice = q.correctAnswer === optIdx;

                      let style =
                        "border-zinc-200 bg-zinc-50 text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300";

                      if (isCorrectChoice) {
                        style =
                          "border-emerald-300 bg-emerald-50 text-emerald-900 font-medium dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-200";
                      } else if (isUserChoice && !isCorrect) {
                        style =
                          "border-red-300 bg-red-50 text-red-900 font-medium dark:border-red-800 dark:bg-red-950/60 dark:text-red-200";
                      }

                      return (
                        <div
                          key={optIdx}
                          className={`flex items-center justify-between rounded-lg border p-3 text-sm ${style}`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold bg-white/80 dark:bg-zinc-900/80">
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span>{opt}</span>
                          </div>

                          <div className="flex items-center gap-2 text-xs">
                            {isUserChoice && (
                              <span className="font-semibold text-zinc-500 dark:text-zinc-400">
                                (Your choice)
                              </span>
                            )}
                            {isCorrectChoice && (
                              <span className="font-semibold text-emerald-700 dark:text-emerald-300">
                                Correct Answer
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="flex justify-between pt-4">
          <Link
            href="/quiz"
            className="inline-flex h-10 items-center justify-center rounded-md border border-zinc-300 px-4 text-sm font-medium transition hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
          >
            ← Retake Quiz
          </Link>
          <Link
            href="/weak-areas"
            className="inline-flex h-10 items-center justify-center rounded-md bg-zinc-900 px-4 text-sm font-medium text-white transition hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
          >
            Review Weak Areas →
          </Link>
        </div>
      </div>
    </div>
  );
}
