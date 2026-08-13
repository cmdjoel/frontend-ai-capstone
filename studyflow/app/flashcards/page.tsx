import Link from "next/link";

export const metadata = {
  title: "Flashcards | StudyFlow",
  description: "Interactive study flashcards",
};

export default function FlashcardsPage() {
  return (
    <div className="flex flex-1 flex-col p-6 md:p-12">
      <div className="mx-auto w-full max-w-3xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Flashcards
          </h1>
          <p className="mt-2 text-base text-zinc-600 dark:text-zinc-400">
            This placeholder page will host interactive flashcards for self-testing terms, definitions, and formulas.
          </p>
        </div>

        <div className="flex h-64 items-center justify-center rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="text-center">
            <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
              Interactive Flashcard Component Placeholder
            </p>
            <p className="mt-1 text-xs text-zinc-500">
              (Card flipping & flip deck logic will be implemented here)
            </p>
          </div>
        </div>

        <div className="flex justify-between pt-4">
          <Link
            href="/summary"
            className="inline-flex h-10 items-center justify-center rounded-md border border-zinc-300 px-4 text-sm font-medium transition hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
          >
            ← Back to Summary
          </Link>
          <Link
            href="/quiz"
            className="inline-flex h-10 items-center justify-center rounded-md bg-zinc-900 px-4 text-sm font-medium text-white transition hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
          >
            Next: Quiz →
          </Link>
        </div>
      </div>
    </div>
  );
}
