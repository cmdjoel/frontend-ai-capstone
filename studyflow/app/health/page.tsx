import Link from "next/link";

export const metadata = {
  title: "Health Check | StudyFlow",
  description: "Application health check and system status",
};

export default function HealthPage() {
  return (
    <div className="flex flex-1 flex-col p-6 md:p-12">
      <div className="mx-auto w-full max-w-3xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            System Health Check
          </h1>
          <p className="mt-2 text-base text-zinc-600 dark:text-zinc-400">
            This page will be used later as a health-check page that renders fetched system and API data.
          </p>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center gap-3">
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500" />
            </span>
            <span className="font-semibold text-zinc-900 dark:text-zinc-100">Status: Operational (Placeholder)</span>
          </div>
          <p className="mt-3 text-xs text-zinc-500">
            Endpoint ping and telemetry verification logic will be rendered here.
          </p>
        </div>

        <div className="pt-4">
          <Link
            href="/"
            className="inline-flex h-10 items-center justify-center rounded-md border border-zinc-300 px-4 text-sm font-medium transition hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
