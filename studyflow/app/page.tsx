"use client";

import Link from "next/link";
import { useStudySession } from "@/context/StudySessionContext";
import { KnowledgeArtifact } from "@/components/landing/KnowledgeArtifact";
import { TransformationFlow } from "@/components/landing/TransformationFlow";
import { BentoFeatures } from "@/components/landing/BentoFeatures";
import { EnterWorkspacePortal } from "@/components/landing/EnterWorkspacePortal";

export default function HomePage() {
  const { session, isHydrated } = useStudySession();

  return (
    <div className="relative flex flex-1 flex-col overflow-x-hidden bg-white text-zinc-900 dark:bg-black dark:text-zinc-100">
      {/* SECTION 1: CINEMATIC HERO */}
      <section className="relative w-full pt-12 sm:pt-20 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8 border-b border-zinc-200 dark:border-zinc-800 bg-grid-pattern">
        {/* Subtle radial lighting overlay */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-blue-500/5 via-transparent to-transparent pointer-events-none" />

        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Content Column (7 cols) */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-900 px-3.5 py-1 text-xs font-mono text-zinc-700 dark:text-zinc-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span>STUDYFLOW // COGNITIVE WORKSPACE</span>
              </div>

              <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 leading-[1.08]">
                Transform Raw Notes Into{" "}
                <span className="bg-gradient-to-r from-zinc-900 via-zinc-600 to-zinc-800 dark:from-white dark:via-zinc-300 dark:to-zinc-500 bg-clip-text text-transparent">
                  Mastered Understanding.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Paste your lecture notes or syllabus. StudyFlow automatically
                deconstructs topics, synthesizes core summaries, generates
                interactive flashcards, diagnoses weak areas, and builds your
                personalized study plan.
              </p>

              {/* Primary Session-Aware CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
                {isHydrated && session ? (
                  <>
                    <Link
                      href="/study-pack"
                      className="inline-flex h-12 w-full sm:w-auto items-center justify-center rounded-xl bg-zinc-900 px-6 text-sm font-semibold text-white transition hover:bg-zinc-800 hover:scale-[1.02] dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 shadow-md"
                    >
                      Continue Session: {session.documentName} →
                    </Link>
                    <Link
                      href="/upload"
                      className="inline-flex h-12 w-full sm:w-auto items-center justify-center rounded-xl border border-zinc-300 text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 px-5 text-sm font-medium transition"
                    >
                      Upload New Notes +
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href="/upload"
                      className="inline-flex h-12 w-full sm:w-auto items-center justify-center rounded-xl bg-zinc-900 px-7 text-sm font-semibold text-white transition hover:bg-zinc-800 hover:scale-[1.02] dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 shadow-md"
                    >
                      Begin Study Session →
                    </Link>
                    <Link
                      href="/chat"
                      className="inline-flex h-12 w-full sm:w-auto items-center justify-center rounded-xl border border-zinc-300 text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 px-5 text-sm font-medium transition"
                    >
                      Explore AI Tutor 💬
                    </Link>
                  </>
                )}
              </div>

              {/* Quick Feature Metric Badges */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-zinc-200 dark:border-zinc-800 max-w-md mx-auto lg:mx-0 text-left">
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                    6-in-1
                  </div>
                  <div className="text-[11px] text-zinc-600 dark:text-zinc-400 font-medium">
                    Learning Loop
                  </div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                    100%
                  </div>
                  <div className="text-[11px] text-zinc-600 dark:text-zinc-400 font-medium">
                    Grounded in Notes
                  </div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                    Real-time
                  </div>
                  <div className="text-[11px] text-zinc-600 dark:text-zinc-400 font-medium">
                    Gemini AI Tutor
                  </div>
                </div>
              </div>
            </div>

            {/* Right Centerpiece Column (5 cols) */}
            <div className="lg:col-span-5 flex justify-center">
              <KnowledgeArtifact />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: THE TRANSFORMATION FLOW */}
      <TransformationFlow />

      {/* SECTION 3: EDITORIAL BENTO FEATURES */}
      <BentoFeatures />

      {/* SECTION 4: 3-STEP LEARNING PROTOCOL */}
      <section className="relative w-full py-16 sm:py-24 px-4 sm:px-6 bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto max-w-6xl space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-widest text-zinc-600 dark:text-zinc-400">
              <span className="h-1.5 w-1.5 rounded-full bg-zinc-900 dark:bg-zinc-100" />
              HOW STUDYFLOW WORKS
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
              From Upload to Exam Mastery in Three Steps
            </h2>
            <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400">
              A frictionless path engineered for university students and lifelong learners.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-8 space-y-4 shadow-sm">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900 text-sm font-mono font-bold text-white dark:bg-zinc-100 dark:text-zinc-900">
                01
              </span>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                Paste Your Study Material
              </h3>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Provide your raw lecture transcripts, slides, or reading notes.
                StudyFlow sanitizes the content and boots your isolated study session.
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-8 space-y-4 shadow-sm">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900 text-sm font-mono font-bold text-white dark:bg-zinc-100 dark:text-zinc-900">
                02
              </span>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                Generate Cognitive Modules
              </h3>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Gemini constructs your topic syllabus, synthesizes high-yield summaries,
                and generates active recall flashcard drills tailored to your material.
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-8 space-y-4 shadow-sm">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900 text-sm font-mono font-bold text-white dark:bg-zinc-100 dark:text-zinc-900">
                03
              </span>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                Diagnose & Follow Your Plan
              </h3>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Take practice quizzes, isolate weak areas, and follow your
                day-by-day milestone roadmap while consulting your grounded AI tutor.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: ENTER WORKSPACE PORTAL */}
      <EnterWorkspacePortal />

      {/* SECTION 6: EDITORIAL FOOTER */}
      <footer className="w-full border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 py-10 px-4 sm:px-6">
        <div className="mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="rounded-lg bg-zinc-900 px-2.5 py-1 text-xs font-bold text-white dark:bg-zinc-100 dark:text-zinc-900">
              SF
            </span>
            <span className="text-sm font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              StudyFlow AI Capstone
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-zinc-600 dark:text-zinc-400">
            <Link href="/upload" className="hover:text-zinc-900 dark:hover:text-zinc-100">
              Upload
            </Link>
            <Link href="/study-pack" className="hover:text-zinc-900 dark:hover:text-zinc-100">
              Study Pack
            </Link>
            <Link href="/summary" className="hover:text-zinc-900 dark:hover:text-zinc-100">
              Summary
            </Link>
            <Link href="/flashcards" className="hover:text-zinc-900 dark:hover:text-zinc-100">
              Flashcards
            </Link>
            <Link href="/quiz" className="hover:text-zinc-900 dark:hover:text-zinc-100">
              Quiz
            </Link>
            <Link href="/weak-areas" className="hover:text-zinc-900 dark:hover:text-zinc-100">
              Weak Areas
            </Link>
            <Link href="/study-plan" className="hover:text-zinc-900 dark:hover:text-zinc-100">
              Study Plan
            </Link>
            <Link href="/chat" className="hover:text-zinc-900 dark:hover:text-zinc-100">
              AI Tutor
            </Link>
            <Link href="/settings" className="hover:text-zinc-900 dark:hover:text-zinc-100">
              Settings
            </Link>
          </div>

          <div className="text-xs text-zinc-600 dark:text-zinc-400 font-mono">
            Powered by Vercel AI SDK & Gemini
          </div>
        </div>
      </footer>
    </div>
  );
}