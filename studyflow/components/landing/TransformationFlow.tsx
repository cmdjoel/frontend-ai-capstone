"use client";

import { useState } from "react";
import Link from "next/link";

interface StepData {
  id: string;
  number: string;
  title: string;
  category: string;
  tagline: string;
  description: string;
  outputPreview: {
    title: string;
    items: string[];
    badge: string;
  };
  link: string;
}

const STEPS: StepData[] = [
  {
    id: "upload",
    number: "01",
    title: "Ingestion & Extraction",
    category: "Source Material",
    tagline: "Your unstructured lecture notes, slides, or transcripts.",
    description:
      "Paste your lecture transcripts, notes, or coursework. StudyFlow extracts, sanitizes, and prepares your content for cognitive deconstruction.",
    outputPreview: {
      title: "Raw Notes Ingested",
      badge: "Text · Sanitized",
      items: [
        "Unstructured lecture text analyzed",
        "Cleaned & validated session created",
        "Ready for AI topic decomposition",
      ],
    },
    link: "/upload",
  },
  {
    id: "study-pack",
    number: "02",
    title: "Concept Deconstruction",
    category: "Study Pack & Topics",
    tagline: "Automated topic hierarchy and core concepts.",
    description:
      "StudyFlow parses your material into distinct conceptual modules, creating a structured syllabus and key concept milestones.",
    outputPreview: {
      title: "Generated Topic Syllabus",
      badge: "AI Deconstruction",
      items: [
        "Core Topic 1: Memory Management & Paging",
        "Core Topic 2: Virtual Memory & Thrashing",
        "Core Topic 3: CPU Scheduling Algorithms",
      ],
    },
    link: "/study-pack",
  },
  {
    id: "summary",
    number: "03",
    title: "Synthesis & Anchor",
    category: "Executive Summary",
    tagline: "Structured takeaways, key takeaways & formula reference.",
    description:
      "A high-density executive overview providing clear conceptual frameworks and key formulas for rapid revision before exams.",
    outputPreview: {
      title: "Synthesized Overview",
      badge: "Markdown · Formatted",
      items: [
        "Executive TL;DR of primary principles",
        "Key definitions and critical theorems",
        "Bullet-point exam cheat sheet notes",
      ],
    },
    link: "/summary",
  },
  {
    id: "flashcards",
    number: "04",
    title: "Active Recall Engine",
    category: "Flashcards",
    tagline: "Front/back prompt testing for long-term retention.",
    description:
      "Dual-sided active recall flashcards engineered to test conceptual boundaries and lock concepts into long-term memory.",
    outputPreview: {
      title: "Interactive Recall Cards",
      badge: "Active Testing",
      items: [
        "Front: 'What causes thrashing in virtual memory?'",
        "Back: 'Excessive page swapping when working set > RAM.'",
        "Interactive flip state with mastery rating",
      ],
    },
    link: "/flashcards",
  },
  {
    id: "quiz",
    number: "05",
    title: "Diagnostic Quizzing",
    category: "Assessment & Weak Areas",
    tagline: "Multiple-choice evaluation and deterministic gap isolation.",
    description:
      "Challenging practice assessments that diagnose misconceptions and isolate weak areas by topic so you know exactly where to study.",
    outputPreview: {
      title: "Diagnostic Scorecard",
      badge: "Gap Isolation",
      items: [
        "4-Option Multiple Choice Questions",
        "Instant score percentage calculation",
        "Identified Weak Topic: 'Virtual Memory Paging'",
      ],
    },
    link: "/quiz",
  },
  {
    id: "study-plan",
    number: "06",
    title: "Strategic Roadmap",
    category: "Personalized Study Plan",
    tagline: "Day-by-day milestone schedule prioritizing weak topics.",
    description:
      "A customized 3-to-7 day schedule prioritizing your weak areas with specific actionable study drills and duration milestones.",
    outputPreview: {
      title: "Daily Exam Timeline",
      badge: "Personalized",
      items: [
        "Day 1 (High Priority): Virtual Memory Drills (45m)",
        "Day 2 (Medium): CPU Scheduling Practice (1h)",
        "Day 3 (Standard): Final Flashcard Matrix Review (30m)",
      ],
    },
    link: "/study-plan",
  },
];

export function TransformationFlow() {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const activeStep = STEPS[activeStepIndex];

  return (
    <section className="relative w-full border-t border-zinc-200 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-950/50 py-16 sm:py-24 px-4 sm:px-6">
      <div className="mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-zinc-200 dark:border-zinc-800">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-widest text-zinc-500">
              <span className="h-1.5 w-1.5 rounded-full bg-zinc-900 dark:bg-zinc-100" />
              COGNITIVE ARCHITECTURE
            </div>
            <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
              The StudyFlow Transformation
            </h2>
            <p className="mt-2 text-base text-zinc-600 dark:text-zinc-400 max-w-xl">
              How unstructured lecture material is converted into an active,
              high-retention learning system.
            </p>
          </div>

          <div className="text-xs font-mono text-zinc-500">
            PHASE 0{activeStepIndex + 1} OF 0{STEPS.length} // STEP SELECTOR
          </div>
        </div>

        {/* Step Selector Horizontal Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-8 pb-10">
          {STEPS.map((step, idx) => {
            const isActive = activeStepIndex === idx;
            return (
              <button
                key={step.id}
                type="button"
                onClick={() => setActiveStepIndex(idx)}
                className={`flex flex-col items-start p-4 rounded-xl border text-left transition-all duration-200 ${
                  isActive
                    ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900 shadow-md scale-[1.02]"
                    : "border-zinc-200 bg-white hover:border-zinc-300 text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-zinc-700"
                }`}
              >
                <span
                  className={`text-xs font-mono font-bold ${
                    isActive
                      ? "text-zinc-400 dark:text-zinc-600"
                      : "text-zinc-400 dark:text-zinc-500"
                  }`}
                >
                  {step.number}
                </span>
                <span className="mt-2 text-xs font-semibold leading-tight line-clamp-2">
                  {step.category}
                </span>
              </button>
            );
          })}
        </div>

        {/* Interactive Step Detail Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-10 shadow-sm">
          {/* Left Column: Description & Copy */}
          <div className="lg:col-span-7 space-y-5">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-900 text-xs font-mono font-bold text-white dark:bg-zinc-100 dark:text-zinc-900">
                {activeStep.number}
              </span>
              <span className="text-xs font-mono uppercase tracking-wider text-zinc-500">
                {activeStep.category}
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              {activeStep.title}
            </h3>

            <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
              {activeStep.tagline}
            </p>

            <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              {activeStep.description}
            </p>

            <div className="pt-2">
              <Link
                href={activeStep.link}
                className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-900 underline underline-offset-4 hover:text-zinc-600 dark:text-zinc-100 dark:hover:text-zinc-300"
              >
                Go to {activeStep.category} module →
              </Link>
            </div>
          </div>

          {/* Right Column: Glassmorphic Live Simulation Preview */}
          <div className="lg:col-span-5 rounded-xl border border-zinc-200 dark:border-zinc-800/80 bg-zinc-50/80 dark:bg-zinc-950/80 p-6 space-y-4 shadow-inner">
            <div className="flex items-center justify-between border-b border-zinc-200/80 dark:border-zinc-800 pb-3">
              <span className="text-xs font-mono font-semibold text-zinc-500 uppercase">
                {activeStep.outputPreview.title}
              </span>
              <span className="rounded-full bg-zinc-200 dark:bg-zinc-800 px-2.5 py-0.5 text-[10px] font-mono font-semibold text-zinc-700 dark:text-zinc-300">
                {activeStep.outputPreview.badge}
              </span>
            </div>

            <div className="space-y-2.5">
              {activeStep.outputPreview.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 rounded-lg border border-zinc-200/60 dark:border-zinc-800/60 bg-white/80 dark:bg-zinc-900/80 p-3 text-xs leading-relaxed text-zinc-800 dark:text-zinc-200 shadow-sm"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-2 text-[10px] font-mono text-zinc-400">
              <span>REAL-TIME ENGINE</span>
              <span>SYNCHRONIZED WITH SESSION</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
