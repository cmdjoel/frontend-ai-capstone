"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStudySession } from "@/context/StudySessionContext";
import type { StudySession } from "@/lib/study-session/types";

export default function UploadNotesPage() {
  const router = useRouter();
  const { setSession, isHydrated } = useStudySession();

  const [documentName, setDocumentName] = useState("");
  const [sourceText, setSourceText] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedName = documentName.trim();
    const trimmedText = sourceText.trim();

    if (!trimmedName) {
      setError("Please enter a name for your study material.");
      return;
    }

    if (!trimmedText) {
      setError("Please paste or type your lecture notes.");
      return;
    }

    const newSession: StudySession = {
      id: crypto.randomUUID(),
      documentName: trimmedName,
      documentType: "text",
      sourceText: trimmedText,
      createdAt: new Date().toISOString(),

      topics: null,
      summary: null,
      flashcards: null,
      quiz: null,
      quizAnswers: null,
      weakAreas: null,
      studyPlan: null,
    };

    setSession(newSession);
    router.push("/study-pack");
  }

  if (!isHydrated) {
    return (
      <div className="flex flex-1 items-center justify-center p-6">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Loading StudyFlow...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col p-6 md:p-12">
      <div className="mx-auto w-full max-w-3xl space-y-6">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-600 dark:text-zinc-400">
            Study Material
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Upload Notes
          </h1>

          <p className="mt-2 text-base text-zinc-600 dark:text-zinc-400">
            Paste your lecture notes or study material to create a personalized
            StudyFlow session.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 md:p-8"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor="documentName"
                className="text-sm font-medium text-zinc-900 dark:text-zinc-100"
              >
                Study material name
              </label>

              <span className="text-xs text-zinc-600 dark:text-zinc-400">Optional</span>
            </div>

            <input
              id="documentName"
              type="text"
              value={documentName}
              onChange={(event) => {
                setDocumentName(event.target.value);
                setError("");
              }}
              placeholder="e.g. Operating Systems — Lecture 1"
              className="h-11 w-full rounded-md border border-zinc-300 bg-transparent px-3 text-sm outline-none transition placeholder:text-zinc-400 focus:border-zinc-500 dark:border-zinc-700 dark:focus:border-zinc-500"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor="sourceText"
                className="text-sm font-medium text-zinc-900 dark:text-zinc-100"
              >
                Your notes
              </label>

              <span className="text-xs text-zinc-600 dark:text-zinc-400">
                {sourceText.trim().length.toLocaleString()} characters
              </span>
            </div>

            <textarea
              id="sourceText"
              value={sourceText}
              onChange={(event) => {
                setSourceText(event.target.value);
                setError("");
              }}
              placeholder="Paste your lecture notes, textbook excerpts, or other study material here..."
              className="min-h-72 w-full resize-y rounded-md border border-zinc-300 bg-transparent p-4 text-sm leading-6 outline-none transition placeholder:text-zinc-400 focus:border-zinc-500 dark:border-zinc-700 dark:focus:border-zinc-500"
            />
          </div>

          {error && (
            <div
              role="alert"
              className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-400"
            >
              {error}
            </div>
          )}

          <div className="flex flex-col-reverse gap-3 border-t border-zinc-200 pt-6 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800">
            <Link
              href="/"
              className="inline-flex h-10 items-center justify-center rounded-md border border-zinc-300 px-4 text-sm font-medium transition hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
            >
              ← Back to Home
            </Link>

            <button
              type="submit"
              className="inline-flex h-10 items-center justify-center rounded-md bg-zinc-900 px-5 text-sm font-medium text-white transition hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
            >
              Create Study Session →
            </button>
          </div>
        </form>

        <p className="text-center text-xs text-zinc-600 dark:text-zinc-400">
          PDF upload and document extraction will be added next. For now, paste
          your study material directly into StudyFlow.
        </p>
      </div>
    </div>
  );
}