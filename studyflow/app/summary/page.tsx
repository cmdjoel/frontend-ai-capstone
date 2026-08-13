import Link from "next/link";

export const metadata = {
  title: "Summary | StudyFlow",
  description: "Topic summaries and key study takeaways",
};

export default function SummaryPage() {
  return (
    <div className="flex flex-1 flex-col p-6 md:p-12">
      <div className="mx-auto w-full max-w-3xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Summary
          </h1>
          <p className="mt-2 text-base text-zinc-600 dark:text-zinc-400">
            This placeholder page will render high-level topic summaries, key bullet points, and AI-synthesized explanations for quick revision.
          </p>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
            Summary View Placeholder
          </p>
          <div className="mt-4 space-y-2 text-xs text-zinc-500">
            <div className="h-4 w-3/4 rounded bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
            <div className="h-4 w-5/6 rounded bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
            <div className="h-4 w-2/3 rounded bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
          </div>
        </div>

        <div className="flex justify-between pt-4">
          <Link
            href="/study-pack"
            className="inline-flex h-10 items-center justify-center rounded-md border border-zinc-300 px-4 text-sm font-medium transition hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
          >
            ← Back to Study Pack
          </Link>
          <Link
            href="/flashcards"
            className="inline-flex h-10 items-center justify-center rounded-md bg-zinc-900 px-4 text-sm font-medium text-white transition hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
          >
            Next: Flashcards →
          </Link>
        </div>
      </div>
    </div>
  );
}
