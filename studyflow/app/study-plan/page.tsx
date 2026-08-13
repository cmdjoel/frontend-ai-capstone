import Link from "next/link";

export const metadata = {
  title: "Study Plan | StudyFlow",
  description: "Personalized study schedule leading up to your exam date",
};

export default function StudyPlanPage() {
  return (
    <div className="flex flex-1 flex-col p-6 md:p-12">
      <div className="mx-auto w-full max-w-3xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Study Plan
          </h1>
          <p className="mt-2 text-base text-zinc-600 dark:text-zinc-400">
            This placeholder page will display a personalized calendar and daily study milestones based on your exam date and daily study goals.
          </p>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
            Daily Milestone Schedule
          </h2>
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between rounded-md border border-zinc-100 p-3 dark:border-zinc-800">
              <span className="text-sm font-medium">Day 1: Topic Review & Flashcards</span>
              <span className="text-xs text-zinc-500">1.5 hours</span>
            </div>
            <div className="flex items-center justify-between rounded-md border border-zinc-100 p-3 dark:border-zinc-800">
              <span className="text-sm font-medium">Day 2: Practice Quiz & Weak Area Drills</span>
              <span className="text-xs text-zinc-500">2.0 hours</span>
            </div>
          </div>
        </div>

        <div className="flex justify-between pt-4">
          <Link
            href="/weak-areas"
            className="inline-flex h-10 items-center justify-center rounded-md border border-zinc-300 px-4 text-sm font-medium transition hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
          >
            ← Back to Weak Areas
          </Link>
          <Link
            href="/settings"
            className="inline-flex h-10 items-center justify-center rounded-md bg-zinc-900 px-4 text-sm font-medium text-white transition hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
          >
            Configure Preferences →
          </Link>
        </div>
      </div>
    </div>
  );
}
