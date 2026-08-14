import Link from "next/link";

export const metadata = {
  title: "System Health | StudyFlow",
  description: "Server-side health check and external API data fetching verification",
};

interface TodoHealthData {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

interface HealthCheckResult {
  success: boolean;
  data?: TodoHealthData;
  error?: string;
  timestamp: string;
}

async function getHealthData(): Promise<HealthCheckResult> {
  const timestamp = new Date().toISOString();
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/todos/1", {
      cache: "no-store",
    });

    if (!response.ok) {
      return {
        success: false,
        error: `Server responded with status code ${response.status} (${response.statusText})`,
        timestamp,
      };
    }

    const data: TodoHealthData = await response.json();
    return {
      success: true,
      data,
      timestamp,
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to connect to external service",
      timestamp,
    };
  }
}

export default async function HealthPage() {
  const result = await getHealthData();

  return (
    <div className="flex flex-1 flex-col p-6 md:p-12">
      <div className="mx-auto w-full max-w-3xl space-y-6">
        <header>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              System Health
            </h1>
            {result.success ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-0.5 text-xs font-semibold text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Healthy
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-100 px-3 py-0.5 text-xs font-semibold text-rose-800 dark:bg-rose-950/80 dark:text-rose-300">
                <span className="h-2 w-2 rounded-full bg-rose-500" />
                Unhealthy
              </span>
            )}
          </div>
          <p className="mt-2 text-base text-muted-foreground">
            This page verifies server-side data fetching in Next.js Server Components by retrieving live data from an external API at request time.
          </p>
        </header>

        {result.success && result.data ? (
          <div className="space-y-4">
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="border-b border-border pb-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="text-lg font-semibold text-card-foreground">
                    Live Server Fetch Verification
                  </h2>
                  <span className="rounded bg-secondary px-2 py-1 font-mono text-xs text-secondary-foreground">
                    GET https://jsonplaceholder.typicode.com/todos/1
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Fetched dynamically via server component on {result.timestamp}
                </p>
              </div>

              <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-lg border border-border bg-secondary/40 p-3">
                  <dt className="text-xs font-medium text-muted-foreground">Todo ID</dt>
                  <dd className="mt-1 font-mono text-sm font-semibold text-foreground">
                    {result.data.id}
                  </dd>
                </div>

                <div className="rounded-lg border border-border bg-secondary/40 p-3">
                  <dt className="text-xs font-medium text-muted-foreground">User ID</dt>
                  <dd className="mt-1 font-mono text-sm font-semibold text-foreground">
                    {result.data.userId}
                  </dd>
                </div>

                <div className="rounded-lg border border-border bg-secondary/40 p-3 sm:col-span-2">
                  <dt className="text-xs font-medium text-muted-foreground">Title</dt>
                  <dd className="mt-1 text-sm font-medium text-foreground">
                    {result.data.title}
                  </dd>
                </div>

                <div className="rounded-lg border border-border bg-secondary/40 p-3 sm:col-span-2">
                  <dt className="text-xs font-medium text-muted-foreground">Completed Status</dt>
                  <dd className="mt-1 flex items-center gap-2">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        result.data.completed
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                          : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                      }`}
                    >
                      {result.data.completed ? "Completed (true)" : "Pending (false)"}
                    </span>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-6 dark:border-rose-900/50 dark:bg-rose-950/20">
            <h2 className="text-lg font-semibold text-rose-900 dark:text-rose-200">
              Unable to Fetch Health Data
            </h2>
            <p className="mt-2 text-sm text-rose-700 dark:text-rose-300">
              {result.error || "An unexpected error occurred while communicating with the health check service."}
            </p>
            <p className="mt-2 text-xs text-rose-600 dark:text-rose-400">
              Checked at {result.timestamp}
            </p>
          </div>
        )}

        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex h-10 items-center justify-center rounded-md border border-border px-4 text-sm font-medium transition hover:bg-secondary"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
