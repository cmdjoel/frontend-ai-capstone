"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useChat } from "@ai-sdk/react";
import { useStudySession } from "@/context/StudySessionContext";
import { loadSettingsFromStorage } from "@/lib/settings/storage";
import type { StudyChatContext } from "@/app/api/chat/route";
import { MarkdownContent } from "./MarkdownContent";

const DEFAULT_SUGGESTED_PROMPTS = [
  "Explain photosynthesis with key active recall questions.",
  "Create a 3-day study plan for organic chemistry.",
  "What is the difference between Mitosis and Meiosis?",
  "Generate 5 quiz flashcards on Newton's Laws.",
];

export function Chat() {
  const { session, isHydrated } = useStudySession();

  const [input, setInput] = useState("");
  const [isAtBottom, setIsAtBottom] = useState(true);
  const shouldAutoScrollRef = useRef(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const messagesContentRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Prepare contextual study session data for the AI Tutor
  const studyContext: StudyChatContext | undefined = useMemo(() => {
    const savedSettings = loadSettingsFromStorage();
    const explanationDetail = savedSettings?.aiExplanationDetail;

    if (!session) {
      return explanationDetail ? { explanationDetail } : undefined;
    }

    let quizPerformance: StudyChatContext["quizPerformance"] = undefined;
    if (session.quiz && session.quizAnswers && session.quiz.length > 0) {
      const totalQuestions = session.quiz.length;
      const correctCount = session.quizAnswers.filter((a) => a.isCorrect).length;
      const incorrectCount = totalQuestions - correctCount;
      const percentage = Math.round((correctCount / totalQuestions) * 100);
      quizPerformance = {
        totalQuestions,
        correctCount,
        incorrectCount,
        percentage,
      };
    }

    return {
      documentName: session.documentName,
      documentType: session.documentType,
      sourceText: session.sourceText,
      topics: session.topics ?? undefined,
      summary: session.summary ?? undefined,
      weakAreas: session.weakAreas ?? undefined,
      quizPerformance,
      studyPlan: session.studyPlan?.map((p) => ({
        title: p.title,
        focus: p.focus,
        duration: p.duration,
        priority: p.priority,
      })),
      explanationDetail,
    };
  }, [session]);

  const { messages, sendMessage, stop, status, error } = useChat();

  const isLoading = status === "submitted" || status === "streaming";
  const isThinking = status === "submitted";

  // Contextual suggested prompts
  const suggestedPrompts = useMemo(() => {
    if (!session) {
      return DEFAULT_SUGGESTED_PROMPTS;
    }

    const prompts: string[] = [];

    if (session.weakAreas && session.weakAreas.length > 0) {
      prompts.push(`Quiz me on my weak area: "${session.weakAreas[0]}"`);
      prompts.push(
        `Explain "${session.weakAreas[0]}" in simple terms with an analogy.`
      );
    } else if (session.topics && session.topics.length > 0) {
      prompts.push(`Quiz me on "${session.topics[0].title}".`);
      prompts.push(`Explain the core concepts from ${session.documentName}.`);
    } else {
      prompts.push(`Summarize the key takeaways from ${session.documentName}.`);
      prompts.push(`Create 5 active-recall questions from my study notes.`);
    }

    if (session.studyPlan && session.studyPlan.length > 0) {
      prompts.push(`How should I structure my study session today?`);
    } else {
      prompts.push(`What topics from my material should I focus on first?`);
    }

    if (prompts.length < 4) {
      prompts.push(`Give me practice problems based on my notes.`);
    }

    return prompts.slice(0, 4);
  }, [session]);

  // Check if user is near bottom on manual scroll
  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const { scrollTop, scrollHeight, clientHeight } = container;
    const distanceToBottom = scrollHeight - scrollTop - clientHeight;
    const nearBottom = distanceToBottom <= 80;

    shouldAutoScrollRef.current = nearBottom;
    setIsAtBottom(nearBottom);
  };

  // ResizeObserver ensures scrolling runs AFTER DOM content layout/expansion
  useEffect(() => {
    const contentEl = messagesContentRef.current;
    const scrollEl = scrollContainerRef.current;
    if (!contentEl || !scrollEl) return;

    const resizeObserver = new ResizeObserver(() => {
      if (shouldAutoScrollRef.current) {
        scrollEl.scrollTop = scrollEl.scrollHeight;
      }
    });

    resizeObserver.observe(contentEl);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  // Effect fallback for immediate message updates
  useEffect(() => {
    if (shouldAutoScrollRef.current && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop =
        scrollContainerRef.current.scrollHeight;
    }
  }, [messages, status]);

  // Jump to latest message
  const scrollToBottom = () => {
    shouldAutoScrollRef.current = true;
    setIsAtBottom(true);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    setInput("");
    shouldAutoScrollRef.current = true;
    setIsAtBottom(true);

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop =
        scrollContainerRef.current.scrollHeight;
    }

    await sendMessage(
      { text: trimmed },
      {
        body: {
          studyContext,
        },
      }
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handlePromptClick = (promptText: string) => {
    setInput(promptText);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  return (
    <div className="flex flex-col h-full max-h-full max-w-4xl w-full mx-auto p-3 sm:p-6 min-h-0">
      {/* Header */}
      <header className="shrink-0 flex flex-col gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-3 mb-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              StudyFlow AI Tutor
            </h1>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
              Your personalized academic assistant grounded in your study
              materials.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 px-2.5 py-1 text-xs font-semibold text-emerald-800 dark:text-emerald-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Gemini Streaming
            </span>
          </div>
        </div>

        {/* Study Context Status Pill */}
        {isHydrated && session && (
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="inline-flex items-center gap-1.5 rounded-md bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 text-xs font-medium text-blue-700 dark:text-blue-300">
              📖 {session.documentName}
            </span>
            {session.topics && session.topics.length > 0 && (
              <span className="inline-flex items-center rounded-md bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 text-xs text-zinc-600 dark:text-zinc-400">
                {session.topics.length} Topics
              </span>
            )}
            {session.weakAreas && session.weakAreas.length > 0 && (
              <span className="inline-flex items-center rounded-md bg-red-50 dark:bg-red-950/60 px-2 py-0.5 text-xs font-medium text-red-700 dark:text-red-300">
                {session.weakAreas.length} Weak{" "}
                {session.weakAreas.length === 1 ? "Area" : "Areas"}
              </span>
            )}
          </div>
        )}

        {isHydrated && !session && (
          <p className="text-xs text-zinc-600 dark:text-zinc-400">
            💡{" "}
            <Link
              href="/upload"
              className="underline hover:text-zinc-800 dark:hover:text-zinc-200"
            >
              Upload lecture notes
            </Link>{" "}
            to give your AI tutor personalized context.
          </p>
        )}
      </header>

      {/* Messages Scroll Area */}
      <div className="relative flex-1 min-h-0 flex flex-col">
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex-1 min-h-0 overflow-y-auto pr-1 chat-scrollbar"
        >
          <div ref={messagesContentRef} className="space-y-4 pb-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center min-h-[300px] h-full text-center p-6 text-zinc-600 dark:text-zinc-400 space-y-4">
                <div className="h-12 w-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-xl font-bold text-zinc-900 dark:text-zinc-100">
                  SF
                </div>
                <div className="max-w-md">
                  <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                    {session
                      ? `How can I help you study "${session.documentName}"?`
                      : "How can I help you study today?"}
                  </h2>
                  <p className="text-xs sm:text-sm mt-1">
                    {session
                      ? "Ask questions about your notes, request explanations on weak areas, or practice active recall."
                      : "Type a topic or select one of the suggested prompts below to start your study session."}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-lg mt-2">
                  {suggestedPrompts.map((prompt, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handlePromptClick(prompt)}
                      className="text-left p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 hover:bg-zinc-50 dark:hover:bg-zinc-800/80 text-xs text-zinc-700 dark:text-zinc-300 transition shadow-sm"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((message) => {
                const isUser = message.role === "user";
                const textContent =
                  message.parts
                    ?.filter(
                      (p): p is { type: "text"; text: string } =>
                        p.type === "text"
                    )
                    .map((p) => p.text)
                    .join("") || "";

                return (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${
                      isUser ? "justify-end" : "justify-start"
                    }`}
                  >
                    {!isUser && (
                      <div className="h-8 w-8 rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                        SF
                      </div>
                    )}

                    <div
                      className={`rounded-2xl px-4 py-3 text-sm leading-relaxed max-w-[88%] sm:max-w-[80%] break-words shadow-sm ${
                        isUser
                          ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 rounded-tr-sm"
                          : "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-tl-sm"
                      }`}
                    >
                      {textContent ? (
                        isUser ? (
                          <div className="whitespace-pre-wrap">
                            {textContent}
                          </div>
                        ) : (
                          <MarkdownContent content={textContent} />
                        )
                      ) : isThinking ? (
                        <div className="flex items-center gap-1.5 py-1">
                          <span className="h-2 w-2 rounded-full bg-zinc-400 dark:bg-zinc-500 animate-bounce [animation-delay:-0.3s]" />
                          <span className="h-2 w-2 rounded-full bg-zinc-400 dark:bg-zinc-500 animate-bounce [animation-delay:-0.15s]" />
                          <span className="h-2 w-2 rounded-full bg-zinc-400 dark:bg-zinc-500 animate-bounce" />
                          <span className="ml-2 text-xs font-medium text-zinc-600 dark:text-zinc-400">
                            Thinking...
                          </span>
                        </div>
                      ) : null}
                    </div>

                    {isUser && (
                      <div className="h-8 w-8 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 flex items-center justify-center text-xs font-semibold shrink-0 mt-0.5">
                        You
                      </div>
                    )}
                  </div>
                );
              })
            )}

            {/* Thinking indicator when awaiting first token */}
            {isThinking && (
              <div className="flex gap-3 justify-start">
                <div className="h-8 w-8 rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  SF
                </div>
                <div className="rounded-2xl rounded-tl-sm px-4 py-3 text-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm">
                  <div className="flex items-center gap-1.5 py-1">
                    <span className="h-2 w-2 rounded-full bg-zinc-400 dark:bg-zinc-500 animate-bounce [animation-delay:-0.3s]" />
                    <span className="h-2 w-2 rounded-full bg-zinc-400 dark:bg-zinc-500 animate-bounce [animation-delay:-0.15s]" />
                    <span className="h-2 w-2 rounded-full bg-zinc-400 dark:bg-zinc-500 animate-bounce" />
                    <span className="ml-2 text-xs font-medium text-zinc-600 dark:text-zinc-400">
                      StudyFlow is thinking...
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Error display */}
            {error && (
              <div
                role="alert"
                className="rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-950/30 p-4 text-xs sm:text-sm text-rose-700 dark:text-rose-300"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Chat Error</span>
                </div>
                <p className="mt-1">
                  {error.message ||
                    "An error occurred while streaming the response. Please try again."}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Floating "Jump to latest" button */}
        {!isAtBottom && messages.length > 0 && (
          <button
            type="button"
            onClick={scrollToBottom}
            aria-label="Jump to latest message"
            className="absolute bottom-3 right-3 z-10 flex items-center gap-1.5 rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-3 py-1.5 text-xs font-semibold shadow-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition"
          >
            <span>↓</span> Jump to latest
          </button>
        )}
      </div>

      {/* Stop generating control */}
      {isLoading && (
        <div className="shrink-0 flex justify-center py-2">
          <button
            type="button"
            onClick={() => stop()}
            aria-label="Stop generating response"
            className="inline-flex items-center gap-1.5 rounded-full border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-1.5 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 shadow-sm transition"
          >
            <span className="h-2 w-2 rounded-sm bg-rose-500" />
            Stop Generating
          </button>
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="shrink-0 mt-2">
        <div className="relative flex items-end rounded-2xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-2 shadow-sm focus-within:border-zinc-500 focus-within:ring-1 focus-within:ring-zinc-500 transition">
          <textarea
            ref={textareaRef}
            id="chat-input"
            rows={1}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              e.target.style.height = "auto";
              e.target.style.height = `${Math.min(
                e.target.scrollHeight,
                160
              )}px`;
            }}
            onKeyDown={handleKeyDown}
            placeholder={
              session
                ? `Ask StudyFlow AI about "${session.documentName}" or your weak areas...`
                : "Ask StudyFlow AI anything (e.g. explain a concept, create a quiz)..."
            }
            aria-label="Ask StudyFlow AI a question"
            className="flex-1 max-h-40 min-h-[40px] resize-none bg-transparent px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 outline-none placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
          />

          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            aria-label="Send message"
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-900 text-white transition hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300 shrink-0 ml-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-4 w-4"
              aria-hidden="true"
            >
              <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
            </svg>
          </button>
        </div>
        <p className="mt-1 text-[11px] text-center text-zinc-600 dark:text-zinc-400">
          Press{" "}
          <kbd className="font-mono bg-zinc-100 dark:bg-zinc-800 px-1 rounded">
            Enter
          </kbd>{" "}
          to send,{" "}
          <kbd className="font-mono bg-zinc-100 dark:bg-zinc-800 px-1 rounded">
            Shift + Enter
          </kbd>{" "}
          for new line.
        </p>
      </form>
    </div>
  );
}
