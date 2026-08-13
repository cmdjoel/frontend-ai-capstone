import Link from "next/link";

export const metadata = {
  title: "Study Pack | StudyFlow",
  description: "View generated study packs and topics",
};

export default function StudyPackPage() {
  return (
    <div className="flex flex-1 flex-col p-6 md:p-12">
      <div className="mx-auto w-full max-w-3xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Study Pack / Topics
          </h1>
          <p className="mt-2 text-base text-zinc-600 dark:text-zinc-400">
            This placeholder page will display the generated study pack topics extracted from your uploaded material.
          </p>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Study Pack Content Modules
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Link
              href="/summary"
              className="rounded-lg border border-zinc-200 p-4 transition hover:border-zinc-400 dark:border-zinc-800"
            >
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">Summary</h3>
              <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
                Key concepts and topic overview.
              </p>
            </Link>
            <Link
              href="/flashcards"
              className="rounded-lg border border-zinc-200 p-4 transition hover:border-zinc-400 dark:border-zinc-800"
            >
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">Flashcards</h3>
              <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
                Interactive memory practice cards.
              </p>
            </Link>
            <Link
              href="/quiz"
              className="rounded-lg border border-zinc-200 p-4 transition hover:border-zinc-400 dark:border-zinc-800"
            >
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">Quiz</h3>
              <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
                Practice questions & assessment.
              </p>
            </Link>
            <Link
              href="/study-plan"
              className="rounded-lg border border-zinc-200 p-4 transition hover:border-zinc-400 dark:border-zinc-800"
            >
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">Study Plan</h3>
              <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
                Scheduled learning timetable.
              </p>
            </Link>
          </div>
        </div>

        <div className="flex justify-between pt-4">
          <Link
            href="/upload"
            className="inline-flex h-10 items-center justify-center rounded-md border border-zinc-300 px-4 text-sm font-medium transition hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
          >
            ← Back to Upload
          </Link>
          <Link
            href="/summary"
            className="inline-flex h-10 items-center justify-center rounded-md bg-zinc-900 px-4 text-sm font-medium text-white transition hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
          >
            Next: Summary →
          </Link>
        </div>
      </div>
    </div>
  );
}
