import Link from "next/link";

export const metadata = {
  title: "Weak Areas | StudyFlow",
  description: "Targeted review of topics requiring additional practice",
};

export default function WeakAreasPage() {
  return (
    <div className="flex flex-1 flex-col p-6 md:p-12">
      <div className="mx-auto w-full max-w-3xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Weak Areas
          </h1>
          <p className="mt-2 text-base text-zinc-600 dark:text-zinc-400">
            This placeholder page will highlight concepts and topics where you answered incorrectly during quizzes for focused review.
          </p>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
            Identified Knowledge Gaps
          </h2>
          <p className="mt-2 text-xs text-zinc-500">
            Topic performance analytics and targeted study recommendations will be listed here.
          </p>
        </div>

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
            View Study Plan →
          </Link>
        </div>
      </div>
    </div>
  );
}
