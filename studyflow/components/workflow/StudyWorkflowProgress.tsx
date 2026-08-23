"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStudySession } from "@/context/StudySessionContext";

export interface WorkflowStep {
  id: string;
  stepNumber: string;
  label: string;
  href: string;
  routes: string[];
}

export const WORKFLOW_STEPS: readonly WorkflowStep[] = [
  {
    id: "upload",
    stepNumber: "01",
    label: "Upload",
    href: "/upload",
    routes: ["/upload"],
  },
  {
    id: "study-pack",
    stepNumber: "02",
    label: "Study Pack",
    href: "/study-pack",
    routes: ["/study-pack", "/summary"],
  },
  {
    id: "learn",
    stepNumber: "03",
    label: "Learn",
    href: "/flashcards",
    routes: ["/flashcards", "/chat"],
  },
  {
    id: "practice",
    stepNumber: "04",
    label: "Practice",
    href: "/quiz",
    routes: ["/quiz", "/quiz/results"],
  },
  {
    id: "review",
    stepNumber: "05",
    label: "Review",
    href: "/weak-areas",
    routes: ["/weak-areas"],
  },
  {
    id: "plan",
    stepNumber: "06",
    label: "Plan",
    href: "/study-plan",
    routes: ["/study-plan"],
  },
] as const;

export function StudyWorkflowProgress() {
  const pathname = usePathname();
  const { session } = useStudySession();

  // Determine active step index based on current route mapping
  const activeStepIndex = WORKFLOW_STEPS.findIndex((step) =>
    step.routes.includes(pathname)
  );

  // If on non-workflow route (like home, settings, health), do not render workflow bar
  if (activeStepIndex === -1) {
    return null;
  }

  // Check stage completion status using study session state & linear sequence
  const isStepCompleted = (stepIndex: number): boolean => {
    if (!session) {
      return stepIndex < activeStepIndex;
    }

    switch (stepIndex) {
      case 0: // Upload
        return Boolean(session);
      case 1: // Study Pack
        return Boolean(session.topics || session.summary);
      case 2: // Learn
        return Boolean(session.flashcards) || stepIndex < activeStepIndex;
      case 3: // Practice
        return Boolean(session.quizAnswers && session.quizAnswers.length > 0);
      case 4: // Review
        return Boolean(session.weakAreas && session.weakAreas.length > 0) || stepIndex < activeStepIndex;
      case 5: // Plan
        return Boolean(session.studyPlan && session.studyPlan.length > 0);
      default:
        return stepIndex < activeStepIndex;
    }
  };

  return (
    <nav
      aria-label="Study Workflow Progress"
      className="border-b border-zinc-200 bg-zinc-50/90 dark:border-zinc-850 dark:bg-zinc-900/50 backdrop-blur-sm"
    >
      <div className="mx-auto max-w-7xl px-3 py-2.5 sm:px-6">
        <ol className="flex items-center justify-between gap-1 sm:gap-2 overflow-x-auto no-scrollbar py-0.5">
          {WORKFLOW_STEPS.map((step, index) => {
            const isActive = index === activeStepIndex;
            const completed = isStepCompleted(index);
            const isLast = index === WORKFLOW_STEPS.length - 1;

            return (
              <li
                key={step.id}
                className="flex items-center flex-1 min-w-0 last:flex-initial"
              >
                <Link
                  href={step.href}
                  className={`group flex items-center gap-1.5 sm:gap-2 rounded-lg px-2 py-1 sm:px-2.5 sm:py-1.5 text-xs font-medium transition shrink-0 ${
                    isActive
                      ? "bg-zinc-900 text-white shadow-sm dark:bg-zinc-100 dark:text-zinc-900 font-semibold"
                      : completed
                      ? "text-zinc-700 hover:bg-zinc-200/70 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                      : "text-zinc-600 hover:bg-zinc-200/50 hover:text-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800/50 dark:hover:text-zinc-300"
                  }`}
                  aria-current={isActive ? "step" : undefined}
                >
                  <span
                    className={`flex h-4 w-4 sm:h-4.5 sm:w-4.5 items-center justify-center rounded-full text-[10px] font-mono transition ${
                      isActive
                        ? "bg-white text-zinc-950 font-bold dark:bg-zinc-900 dark:text-zinc-100"
                        : completed
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold"
                        : "bg-zinc-200 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                    }`}
                  >
                    {completed && !isActive ? "✓" : step.stepNumber}
                  </span>
                  <span className="truncate">{step.label}</span>
                </Link>

                {!isLast && (
                  <div
                    aria-hidden="true"
                    className="flex-1 flex items-center justify-center px-1 sm:px-2 text-zinc-300 dark:text-zinc-700 select-none min-w-3"
                  >
                    <span className="h-px w-full bg-zinc-200 dark:bg-zinc-800 hidden md:block" />
                    <span className="text-[10px] text-zinc-400 dark:text-zinc-600 md:hidden">
                      →
                    </span>
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}
