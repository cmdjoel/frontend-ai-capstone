"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { useStudySession } from "@/context/StudySessionContext";

interface WeakTopicSummary {
  topicTitle: string;
  incorrectCount: number;
  totalQuestions: number;
}

export default function WeakAreasPage() {
  const { session, isHydrated, updateSession } = useStudySession();

  const quiz = session?.quiz ?? [];
  const answers = session?.quizAnswers ?? [];
  const topics = session?.topics ?? [];

  // Calculate weak areas deterministically
  const { weakAreaList, weakTopicSummaries } = useMemo(() => {
    if (quiz.length === 0 || answers.length === 0) {
      return { weakAreaList: [], weakTopicSummaries: [] };
    }

    const topicStats: Record<
      string,
      { title: string; incorrect: number; total: number }
    > = {};

    quiz.forEach((q) => {
      let topicKey = "general";
      let topicTitle = "General Concepts";

      if (q.topicId) {
        const found = topics.find((t) => t.id === q.topicId);
        if (found) {
          topicKey = found.id;
          topicTitle = found.title;
        }
      }

      if (!topicStats[topicKey]) {
        topicStats[topicKey] = {
          title: topicTitle,
          incorrect: 0,
          total: 0,
        };
      }

      topicStats[topicKey].total += 1;

      const userAns = answers.find((a) => a.questionId === q.id);
      if (userAns && !userAns.isCorrect) {
        topicStats[topicKey].incorrect += 1;
      }
    });

    const summaries: WeakTopicSummary[] = Object.values(topicStats)
      .filter((s) => s.incorrect > 0)
      .sort((a, b) => b.incorrect - a.incorrect)
      .map((s) => ({
        topicTitle: s.title,
        incorrectCount: s.incorrect,
        totalQuestions: s.total,
      }));

    const titles = summaries.map((s) => s.topicTitle);

    return { weakAreaList: titles, weakTopicSummaries: summaries };
  }, [quiz, answers, topics]);

  // Persist weakAreas without triggering infinite loops
  useEffect(() => {
    if (!isHydrated || quiz.length === 0 || answers.length === 0) {
      return;
    }

    const currentWeakAreas = session?.weakAreas ?? [];
    const isDifferent =
      currentWeakAreas.length !== weakAreaList.length ||
      weakAreaList.some((area, i) => area !== currentWeakAreas[i]);

    if (isDifferent) {
      updateSession({ weakAreas: weakAreaList });
    }
  }, [isHydrated, quiz.length, answers.length, weakAreaList, session?.weakAreas, updateSession]);

  if (!isHydrated) {
    return (
      <div className="flex flex-1 items-center justify-center p-6">
        <p className="text-sm text-zinc-500">
          Analyzing performance & weak areas...
        </p>
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

  const hasCompletedQuiz = quiz.length > 0 && answers.length > 0;

  if (!hasCompletedQuiz) {
    return (
      <div className="flex flex-1 flex-col p-6 md:p-12">
        <div className="mx-auto w-full max-w-3xl space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              No Quiz Results to Analyze
            </h1>
            <p className="mt-2 text-base text-zinc-600 dark:text-zinc-400">
              Complete a practice quiz first so StudyFlow can evaluate your
              answers and highlight knowledge gaps.
            </p>
          </div>
          <div className="pt-2">
            <Link
              href="/quiz"
              className="inline-flex h-10 items-center justify-center rounded-md bg-zinc-900 px-5 text-sm font-medium text-white transition hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
            >
              ← Take the Practice Quiz
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const hasWeakAreas = weakTopicSummaries.length > 0;

  return (
    <div className="flex flex-1 flex-col p-6 md:p-12">
      <div className="mx-auto w-full max-w-3xl space-y-6">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-500">
            Performance Diagnostics
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Identified Weak Areas
          </h1>
          <p className="mt-2 text-base text-zinc-600 dark:text-zinc-400">
            Targeted review of concepts where additional practice will yield the
            highest exam improvement.
          </p>
        </div>

        {hasWeakAreas ? (
          <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 md:p-8">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Topics Requiring Attention
            </h2>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              Based on your quiz results, you missed questions in the following
              areas:
            </p>

            <div className="mt-6 space-y-3">
              {weakTopicSummaries.map((topicSummary, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-lg border border-red-200 bg-red-50/50 p-4 dark:border-red-950 dark:bg-red-950/20"
                >
                  <div className="space-y-1">
                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">
                      {topicSummary.topicTitle}
                    </h3>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400">
                      {topicSummary.incorrectCount} of{" "}
                      {topicSummary.totalQuestions} questions missed in this
                      topic
                    </p>
                  </div>

                  <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-800 dark:bg-red-950 dark:text-red-300">
                    High Priority
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-lg bg-zinc-50 p-4 text-xs text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400">
              💡 <strong>Recommendation:</strong> Your personalized Study Plan
              will prioritize these {weakTopicSummaries.length} weak areas with
              tailored review sessions, active recall drills, and flashcard
              repetition.
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-8 text-center dark:border-emerald-900/60 dark:bg-emerald-950/20">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-2xl text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">
              🎉
            </span>
            <h2 className="mt-4 text-xl font-bold text-emerald-900 dark:text-emerald-200">
              No Major Weak Areas Detected!
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-emerald-800 dark:text-emerald-300">
              You answered every quiz question correctly. Review your summary
              and flashcards periodically to reinforce long-term memory.
            </p>
          </div>
        )}

        {/* Bottom Navigation */}
        <div className="flex justify-between pt-4">
          <Link
            href="/quiz/results"
            className="inline-flex h-10 items-center justify-center rounded-md border border-zinc-300 px-4 text-sm font-medium transition hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
          >
            ← Back to Quiz Results
          </Link>
          <Link
            href="/study-plan"
            className="inline-flex h-10 items-center justify-center rounded-md bg-zinc-900 px-4 text-sm font-medium text-white transition hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
          >
            Generate Study Plan →
          </Link>
        </div>
      </div>
    </div>
  );
}
