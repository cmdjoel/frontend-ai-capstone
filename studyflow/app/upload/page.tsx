import Link from "next/link";

export const metadata = {
  title: "Upload Notes | StudyFlow",
  description: "Upload your study materials and lecture notes",
};

export default function UploadNotesPage() {
  return (
    <div className="flex flex-1 flex-col p-6 md:p-12">
      <div className="mx-auto w-full max-w-3xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Upload Notes
          </h1>
          <p className="mt-2 text-base text-zinc-600 dark:text-zinc-400">
            This placeholder page will allow students to upload PDF files or paste lecture notes to generate a personalized study pack.
          </p>
        </div>

        <div className="rounded-xl border border-dashed border-zinc-300 bg-white p-10 text-center dark:border-zinc-700 dark:bg-zinc-900">
          <div className="mx-auto max-w-sm space-y-3">
            <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
              Note upload interface placeholder
            </p>
            <p className="text-xs text-zinc-500">
              (File upload & PDF parsing logic will be implemented in future iterations)
            </p>
          </div>
        </div>

        <div className="flex justify-between pt-4">
          <Link
            href="/"
            className="inline-flex h-10 items-center justify-center rounded-md border border-zinc-300 px-4 text-sm font-medium transition hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
          >
            ← Back to Home
          </Link>
          <Link
            href="/study-pack"
            className="inline-flex h-10 items-center justify-center rounded-md bg-zinc-900 px-4 text-sm font-medium text-white transition hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
          >
            Next: Study Pack →
          </Link>
        </div>
      </div>
    </div>
  );
}
