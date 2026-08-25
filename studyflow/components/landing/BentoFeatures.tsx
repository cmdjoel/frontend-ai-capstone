"use client";

import { useState } from "react";
import Link from "next/link";

export function BentoFeatures() {
  const [flashcardFlipped, setFlashcardFlipped] = useState(false);

  return (
    <section className="relative w-full py-16 sm:py-24 px-4 sm:px-6 bg-white dark:bg-black">
      <div className="mx-auto max-w-6xl space-y-12">
        {/* Section Header */}
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-widest text-zinc-600 dark:text-zinc-400">
            <span className="h-1.5 w-1.5 rounded-full bg-zinc-900 dark:bg-zinc-100" />
            ENGINEERED FOR RETENTION
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
            Cognitive Tools Built for Deep Comprehension
          </h2>
          <p className="text-base text-zinc-600 dark:text-zinc-400">
            StudyFlow combines proven active recall methodologies with Gemini
            AI intelligence to help you master challenging material in record time.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Bento Item 1: Topic Extraction & Study Pack (7 cols) */}
          <div className="md:col-span-7 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/60 p-6 sm:p-8 flex flex-col justify-between space-y-6 hover:border-zinc-400 dark:hover:border-zinc-700 transition">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-zinc-600 dark:text-zinc-400">
                  01 // STRUCTURE
                </span>
                <span className="rounded-full bg-blue-100 dark:bg-blue-950 px-2.5 py-0.5 text-xs font-semibold text-blue-700 dark:text-blue-300">
                  Topic Hierarchy
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                AI Study Pack & Multi-Topic Deconstruction
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Raw lectures are decomposed into clear conceptual nodes,
                complete with descriptions, key takeaways, and difficulty ratings.
              </p>
            </div>

            {/* Visual Mini Mockup */}
            <div className="space-y-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4 shadow-sm">
              <div className="flex items-center justify-between text-xs font-medium text-zinc-600 dark:text-zinc-400">
                <span>Extracted Syllabus</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">✓ 4 Core Topics</span>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="rounded-lg bg-zinc-100 dark:bg-zinc-900 p-2.5 text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                  1. Process Scheduling
                </div>
                <div className="rounded-lg bg-zinc-100 dark:bg-zinc-900 p-2.5 text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                  2. Memory Management
                </div>
                <div className="rounded-lg bg-zinc-100 dark:bg-zinc-900 p-2.5 text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                  3. Virtual Memory & Paging
                </div>
                <div className="rounded-lg bg-zinc-100 dark:bg-zinc-900 p-2.5 text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                  4. File Systems & I/O
                </div>
              </div>
            </div>

            <Link
              href="/study-pack"
              className="text-xs font-semibold text-zinc-900 underline underline-offset-4 dark:text-zinc-100"
            >
              Explore Study Pack →
            </Link>
          </div>

          {/* Bento Item 2: Interactive Flashcard Engine (5 cols) */}
          <div className="md:col-span-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/60 p-6 sm:p-8 flex flex-col justify-between space-y-6 hover:border-zinc-400 dark:hover:border-zinc-700 transition">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-zinc-600 dark:text-zinc-400">
                  02 // RECALL
                </span>
                <span className="rounded-full bg-emerald-100 dark:bg-emerald-950 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                  Active Testing
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                Interactive Flashcard Engine
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Test yourself with high-yield prompt/answer cards engineered for
                instant retrieval testing.
              </p>
            </div>

            {/* Live Interactive Flip Demonstration */}
            <div
              onClick={() => setFlashcardFlipped((prev) => !prev)}
              className="group relative h-36 w-full cursor-pointer rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 p-4 shadow-sm transition-all hover:border-zinc-500 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between text-[10px] font-mono text-zinc-600 dark:text-zinc-400">
                <span>{flashcardFlipped ? "ANSWER // REVEALED" : "QUESTION // PROMPT"}</span>
                <span className="text-xs text-zinc-600 group-hover:text-zinc-800 dark:text-zinc-400 dark:group-hover:text-zinc-200">
                  (Click to flip ⟳)
                </span>
              </div>

              <p className="text-xs sm:text-sm font-semibold text-zinc-900 dark:text-zinc-100 text-center px-2">
                {flashcardFlipped
                  ? "Virtual Memory allows execution of processes larger than physical RAM via demand paging."
                  : "How does Virtual Memory solve physical RAM limitations?"}
              </p>

              <div className="text-[10px] text-center font-mono text-zinc-600 dark:text-zinc-400 font-medium">
                {flashcardFlipped ? "✓ Verified Active Recall" : "Tap to verify knowledge"}
              </div>
            </div>

            <Link
              href="/flashcards"
              className="text-xs font-semibold text-zinc-900 underline underline-offset-4 dark:text-zinc-100"
            >
              Practice Flashcards →
            </Link>
          </div>

          {/* Bento Item 3: Diagnostic Assessment & Weak Areas (5 cols) */}
          <div className="md:col-span-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/60 p-6 sm:p-8 flex flex-col justify-between space-y-6 hover:border-zinc-400 dark:hover:border-zinc-700 transition">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-zinc-600 dark:text-zinc-400">
                  03 // DIAGNOSTICS
                </span>
                <span className="rounded-full bg-red-100 dark:bg-red-950 px-2.5 py-0.5 text-xs font-semibold text-red-700 dark:text-red-300">
                  Weak Area Isolation
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                Diagnostic AI Quiz & Gap Analysis
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Take realistic practice tests. Incorrect answers are
                deterministically mapped to topics to isolate your exact blind spots.
              </p>
            </div>

            {/* Score & Weak Topic Visual */}
            <div className="rounded-xl border border-red-200/80 dark:border-red-950 bg-red-50/50 dark:bg-red-950/20 p-4 space-y-2 text-xs">
              <div className="flex items-center justify-between font-semibold text-red-800 dark:text-red-300">
                <span>Missed Question Detected</span>
                <span className="rounded bg-red-100 dark:bg-red-900/80 px-2 py-0.5 text-[10px]">
                  High Priority
                </span>
              </div>
              <p className="text-zinc-700 dark:text-zinc-300">
                Topic: <strong>Virtual Memory Paging</strong> (2 questions missed)
              </p>
            </div>

            <Link
              href="/quiz"
              className="text-xs font-semibold text-zinc-900 underline underline-offset-4 dark:text-zinc-100"
            >
              Take Practice Quiz →
            </Link>
          </div>

          {/* Bento Item 4: Strategic Study Plan & Context AI Tutor (7 cols) */}
          <div className="md:col-span-7 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/60 p-6 sm:p-8 flex flex-col justify-between space-y-6 hover:border-zinc-400 dark:hover:border-zinc-700 transition">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-zinc-600 dark:text-zinc-400">
                  04 // ROADMAP & TUTOR
                </span>
                <span className="rounded-full bg-purple-100 dark:bg-purple-950 px-2.5 py-0.5 text-xs font-semibold text-purple-700 dark:text-purple-300">
                  Personalized AI
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                Personalized Study Plan & Context-Aware AI Tutor
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Receive a structured daily milestone schedule that prioritizes
                your weak areas first, backed by a real-time streaming tutor that
                knows your exact notes.
              </p>
            </div>

            {/* Timeline Visual Mock */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4 shadow-sm text-xs">
              <div className="space-y-1 border-l-2 border-red-500 pl-3">
                <span className="font-bold text-zinc-900 dark:text-zinc-100">
                  Day 1: Virtual Memory Drills
                </span>
                <p className="text-zinc-600 dark:text-zinc-400 text-[11px] font-medium">
                  ⏱️ 45m · High Priority (Weak Area)
                </p>
              </div>
              <div className="space-y-1 border-l-2 border-emerald-500 pl-3">
                <span className="font-bold text-zinc-900 dark:text-zinc-100">
                  Day 2: AI Tutor Chat Review
                </span>
                <p className="text-zinc-600 dark:text-zinc-400 text-[11px] font-medium">
                  ⏱️ 30m · Interactive Socratic Drill
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Link
                href="/study-plan"
                className="text-xs font-semibold text-zinc-900 underline underline-offset-4 dark:text-zinc-100"
              >
                View Study Plan →
              </Link>
              <Link
                href="/chat"
                className="text-xs font-semibold text-zinc-900 underline underline-offset-4 dark:text-zinc-100"
              >
                Chat with AI Tutor →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
