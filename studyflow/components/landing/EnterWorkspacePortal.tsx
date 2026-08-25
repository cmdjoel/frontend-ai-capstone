"use client";

import Link from "next/link";
import { useStudySession } from "@/context/StudySessionContext";

export function EnterWorkspacePortal() {
  const { session, isHydrated } = useStudySession();

  return (
    <section className="relative w-full py-20 sm:py-28 px-4 sm:px-6 bg-zinc-950 text-white overflow-hidden border-t border-zinc-800">
      {/* Background ambient lighting and grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-gradient-to-r from-blue-600/20 via-emerald-600/20 to-purple-600/20 blur-3xl pointer-events-none animate-pulse-glow" />

      <div className="relative mx-auto max-w-4xl text-center space-y-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-zinc-700/80 bg-zinc-900/90 px-3.5 py-1 text-xs font-mono text-zinc-300 backdrop-blur-md">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
          <span>PORTAL // READY FOR INGESTION</span>
        </div>

        <div className="space-y-4">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Ready to Unlock Your Complete Learning Flow?
          </h2>
          <p className="mx-auto max-w-2xl text-base sm:text-lg text-zinc-400">
            Drop in your lecture material. Experience automated topic extraction,
            active recall testing, diagnostic quizzing, and personalized study
            planning in seconds.
          </p>
        </div>

        {/* Portal Action Trigger */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          {isHydrated && session ? (
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link
                href="/study-pack"
                className="group relative inline-flex h-14 items-center justify-center gap-3 rounded-xl bg-white px-8 text-base font-bold text-zinc-950 transition hover:bg-zinc-200 hover:scale-[1.02] shadow-2xl"
              >
                <span>Continue: {session.documentName}</span>
                <span className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </Link>

              <Link
                href="/upload"
                className="inline-flex h-14 items-center justify-center rounded-xl border border-zinc-700 bg-zinc-900/90 px-6 text-sm font-medium text-zinc-300 transition hover:border-zinc-500 hover:bg-zinc-800 hover:text-white"
              >
                Upload New Notes +
              </Link>
            </div>
          ) : (
            <Link
              href="/upload"
              className="group relative inline-flex h-14 items-center justify-center gap-3 rounded-xl bg-white px-8 text-base font-bold text-zinc-950 transition hover:bg-zinc-200 hover:scale-[1.02] shadow-2xl"
            >
              <span>Enter Workspace & Upload Notes</span>
              <span className="transition-transform group-hover:translate-x-1">
                →
              </span>
            </Link>
          )}
        </div>

        {/* Status Indicators */}
        <div className="flex flex-wrap items-center justify-center gap-6 pt-6 text-xs font-mono text-zinc-400">
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Vercel AI SDK & Gemini 3.1
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
            100% Client LocalStorage Session
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-purple-500" />
            Deterministic Weak Area Isolation
          </span>
        </div>
      </div>
    </section>
  );
}
