import Link from "next/link";

export const metadata = {
  title: "Home | StudyFlow",
  description: "AI-powered study assistant workflow",
};

export default function HomePage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center p-6 md:p-12">
      <div className="mx-auto w-full max-w-4xl space-y-8 text-center sm:text-left">
        <div className="space-y-4">
          <span className="inline-block rounded-full bg-zinc-200 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
            StudyFlow Application Flow
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 sm:text-5xl dark:text-zinc-50">
            Welcome to StudyFlow
          </h1>
          <p className="max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
            StudyFlow helps students transform raw lecture notes and PDFs into structured study packs, summaries, interactive flashcards, quizzes, and personalized study plans.
          </p>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
            Application Flow Overview
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Link
              href="/upload"
              className="group rounded-lg border border-zinc-200 p-4 transition hover:border-zinc-400 hover:shadow-md dark:border-zinc-800 dark:hover:border-zinc-700"
            >
              <div className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">Step 1</div>
              <div className="text-lg font-medium text-zinc-900 group-hover:underline dark:text-zinc-100">
                Upload Notes
              </div>
              <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
                Upload lecture notes or documents.
              </p>
            </Link>

            <Link
              href="/study-pack"
              className="group rounded-lg border border-zinc-200 p-4 transition hover:border-zinc-400 hover:shadow-md dark:border-zinc-800 dark:hover:border-zinc-700"
            >
              <div className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">Step 2</div>
              <div className="text-lg font-medium text-zinc-900 group-hover:underline dark:text-zinc-100">
                Study Pack / Topics
              </div>
              <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
                View generated topics and study modules.
              </p>
            </Link>

            <Link
              href="/summary"
              className="group rounded-lg border border-zinc-200 p-4 transition hover:border-zinc-400 hover:shadow-md dark:border-zinc-800 dark:hover:border-zinc-700"
            >
              <div className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">Module</div>
              <div className="text-lg font-medium text-zinc-900 group-hover:underline dark:text-zinc-100">
                Summary
              </div>
              <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
                Read topic summaries and key takeaways.
              </p>
            </Link>

            <Link
              href="/flashcards"
              className="group rounded-lg border border-zinc-200 p-4 transition hover:border-zinc-400 hover:shadow-md dark:border-zinc-800 dark:hover:border-zinc-700"
            >
              <div className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">Module</div>
              <div className="text-lg font-medium text-zinc-900 group-hover:underline dark:text-zinc-100">
                Flashcards
              </div>
              <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
                Practice key concepts with flashcards.
              </p>
            </Link>

            <Link
              href="/quiz"
              className="group rounded-lg border border-zinc-200 p-4 transition hover:border-zinc-400 hover:shadow-md dark:border-zinc-800 dark:hover:border-zinc-700"
            >
              <div className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">Module</div>
              <div className="text-lg font-medium text-zinc-900 group-hover:underline dark:text-zinc-100">
                Quiz & Results
              </div>
              <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
                Test knowledge & identify weak areas.
              </p>
            </Link>

            <Link
              href="/study-plan"
              className="group rounded-lg border border-zinc-200 p-4 transition hover:border-zinc-400 hover:shadow-md dark:border-zinc-800 dark:hover:border-zinc-700"
            >
              <div className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">Module</div>
              <div className="text-lg font-medium text-zinc-900 group-hover:underline dark:text-zinc-100">
                Study Plan
              </div>
              <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
                Follow your structured exam study schedule.
              </p>
            </Link>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 pt-2">
          <Link
            href="/upload"
            className="inline-flex h-11 items-center justify-center rounded-md bg-zinc-900 px-6 text-sm font-medium text-white transition hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
          >
            Start by Uploading Notes →
          </Link>
        </div>
      </div>
    </div>
  );
}