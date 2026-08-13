import Link from "next/link";

export const metadata = {
  title: "Quiz Results | StudyFlow",
  description: "Review your quiz performance and score breakdown",
};

export default function QuizResultsPage() {
  return (
    <div className="flex flex-1 flex-col p-6 md:p-12">
      <div className="mx-auto w-full max-w-3xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Quiz Results
          </h1>
          <p className="mt-2 text-base text-zinc-600 dark:text-zinc-400">
            This placeholder page will display quiz scores, detailed answer explanations, and performance metrics.
          </p>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between border-b border-zinc-200 pb-4 dark:border-zinc-800">
            <div>
              <span className="text-sm font-medium text-zinc-500">Overall Score</span>
              <p className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50">85%</p>
            </div>
            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800 dark:bg-green-950 dark:text-green-300">
              Passed
            </span>
          </div>
          <p className="mt-4 text-xs text-zinc-500">
            Detailed breakdown and feedback per question will be displayed here.
          </p>
        </div>

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
