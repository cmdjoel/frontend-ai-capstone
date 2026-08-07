"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormField } from "@/components/ui/FormField";
import { Toast } from "@/components/ui/Toast";
import {
  AI_EXPLANATION_OPTIONS,
  QUIZ_DIFFICULTY_OPTIONS,
  defaultSettingsValues,
  settingsSchema,
  type SettingsFormValues,
} from "@/lib/settings/schema";
import { loadSettingsFromStorage, persistSettings } from "@/lib/settings/storage";

const inputClassName =
  "w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-500 dark:focus:ring-zinc-800";

export function SettingsForm() {
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: defaultSettingsValues,
  });

  useEffect(() => {
    const savedSettings = loadSettingsFromStorage();
    if (savedSettings) {
      reset(savedSettings);
    }
  }, [reset]);

  const onSubmit = async (values: SettingsFormValues) => {
    await persistSettings(values);
    setShowSuccessToast(true);
  };

  return (
    <>
      <form
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        className="mx-auto flex w-full max-w-xl flex-col gap-6"
      >
        <FormField id="examDate" label="Exam Date" error={errors.examDate?.message}>
          <input
            id="examDate"
            type="date"
            aria-invalid={Boolean(errors.examDate)}
            aria-describedby={errors.examDate ? "examDate-error" : undefined}
            className={inputClassName}
            {...register("examDate")}
          />
        </FormField>

        <FormField
          id="studyHoursPerDay"
          label="Study Hours Per Day"
          error={errors.studyHoursPerDay?.message}
        >
          <input
            id="studyHoursPerDay"
            type="number"
            min={1}
            max={12}
            step={1}
            aria-invalid={Boolean(errors.studyHoursPerDay)}
            aria-describedby={errors.studyHoursPerDay ? "studyHoursPerDay-error" : undefined}
            className={inputClassName}
            {...register("studyHoursPerDay", { valueAsNumber: true })}
          />
        </FormField>

        <FormField
          id="quizDifficulty"
          label="Preferred Quiz Difficulty"
          error={errors.quizDifficulty?.message}
        >
          <select
            id="quizDifficulty"
            aria-invalid={Boolean(errors.quizDifficulty)}
            aria-describedby={errors.quizDifficulty ? "quizDifficulty-error" : undefined}
            className={inputClassName}
            {...register("quizDifficulty")}
          >
            <option value="">Select difficulty</option>
            {QUIZ_DIFFICULTY_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </FormField>

        <FormField
          id="aiExplanationDetail"
          label="AI Explanation Detail"
          error={errors.aiExplanationDetail?.message}
        >
          <select
            id="aiExplanationDetail"
            aria-invalid={Boolean(errors.aiExplanationDetail)}
            aria-describedby={
              errors.aiExplanationDetail ? "aiExplanationDetail-error" : undefined
            }
            className={inputClassName}
            {...register("aiExplanationDetail")}
          >
            <option value="">Select detail level</option>
            {AI_EXPLANATION_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </FormField>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex h-11 items-center justify-center rounded-md bg-zinc-900 px-4 text-sm font-medium text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          {isSubmitting ? "Saving..." : "Save Settings"}
        </button>
      </form>

      {showSuccessToast ? (
        <Toast message="Settings saved successfully." onDismiss={() => setShowSuccessToast(false)} />
      ) : null}
    </>
  );
}
