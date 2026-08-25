# StudyFlow

StudyFlow is an AI-powered study platform that helps students turn their study material into structured, personalized learning resources. Users upload study material and work through an AI-generated study workflow including summaries, flashcards, AI tutoring, quizzes, weak-area identification, and a personalized study plan. I chose this project because studying from large amounts of notes can be inefficient, and I wanted to build an application where AI supports an actual learning workflow rather than functioning as a standalone chatbot.

## Live Application

https://studyflow-umber-chi.vercel.app

## Tech Stack

- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- React Server Components (default; interactive pages/components use `"use client"` where needed)
- Framer Motion (custom cursor)
- Vercel AI SDK (`ai`, `@ai-sdk/google`)
- Google Gemini (`gemini-3.1-flash-lite`)
- Vitest
- Vercel (hosting/deployment)

## Getting Started

### Prerequisites

- Node.js (LTS)
- Git
- A Google Gemini API key ([Google AI Studio](https://aistudio.google.com/apikey))

### Installation

Clone the repository:

```bash
git clone https://github.com/cmdjoel/frontend-ai-capstone.git
cd frontend-ai-capstone/studyflow
```

Install dependencies:

```bash
npm install
```

Create a `.env.local` file in the project root:

```bash
GEMINI_API_KEY=your_api_key_here
```

Start the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Architecture

StudyFlow uses the Next.js App Router.

### Main Application Areas

- `/` — Landing page
- `/upload` — Upload study material and create a study session
- `/study-pack` — Generated study pack and topics
- `/summary` — AI-generated study summary
- `/flashcards` — AI-generated flashcards
- `/chat` — Context-aware AI study tutor (streaming)
- `/quiz` — AI-generated quiz
- `/quiz/results` — Quiz results and learning feedback
- `/weak-areas` — Identified weak areas
- `/study-plan` — Personalized study plan
- `/settings` — Application and AI preferences
- `/health` — Server-side health/data-fetching demonstration (hidden from navigation, not deleted)

Study session state (uploaded material, generated topics, flashcards, quiz answers, weak areas, study plan) is stored **entirely client-side via localStorage**, exposed through `StudySessionContext`, so progress persists across page reloads without a database.

API routes under `/api` (`chat`, `quiz`, `flashcards`, `study-pack`, `study-plan`, `summary`) handle server-side AI generation.

## AI Integration

AI is a core part of the StudyFlow learning workflow rather than a standalone chatbot. All AI features run through the Vercel AI SDK against Google's Gemini model (`gemini-3.1-flash-lite`, via `@ai-sdk/google`).

AI-powered features:

- Study pack generation
- Summary generation
- Flashcard generation
- Context-aware, streaming AI tutoring (`/chat`, using `streamText`)
- Quiz generation
- Weak-area identification
- Personalized study-plan generation

The AI tutor is grounded in the user's uploaded study material via a system prompt (see below) and remains scoped to that context rather than answering as a general-purpose chatbot.

### Why AI Is Meaningful

Without AI, a student would need to manually summarize notes, create flashcards, write practice questions, identify weak topics, and build a study schedule. StudyFlow automates each of these while keeping them connected into a single, sequential learning workflow rather than isolated tools.

## AI Prompting

Each AI feature uses a structured system/instruction prompt tailored to its task, combined with the user's own study material and, where relevant, their saved preferences from `/settings`.

**Example — AI Tutor system prompt** (`lib/ai/config.ts`):

```text
You are StudyFlow AI, an intelligent, supportive, and structured academic study assistant.
Your goal is to help students learn effectively from their study materials, lecture notes, and coursework.

Core guidelines:
- Provide clear, concise, and structured explanations.
- Break complex academic topics into digestible concepts.
- Use formatting such as bullet points, numbered lists, and bold text to improve readability.
- When explaining concepts, include practical examples, analogies, or active recall questions when appropriate.
- Maintain an encouraging, positive, and educational tone.
- If the user asks for summaries, flashcards, or practice questions, format them clearly for active learning.
```

**Settings-driven prompt adaptation:** user preferences from `/settings` are appended as additional instructions rather than replacing the base prompt, so grounding and safety behavior stay intact. For example, Quiz Difficulty maps to distinct instruction sets (Easy → basic recall and direct understanding; Medium → application and moderate reasoning; Hard → deeper reasoning and concept comparison), and AI Explanation Detail similarly scales summary/tutor responses from concise to thorough. Study Hours Per Day and Exam Date are passed as planning context to the study-plan generation prompt, alongside the existing weak-area prioritization.

Quiz and flashcard generation additionally request structured, predictable output formats so the frontend can safely parse and render results.

## Resilience and Error Handling

AI requests can fail or return malformed results, so each API route validates input and handles unsuccessful AI responses without leaving the user on a broken screen. This is covered by automated tests simulating rate-limit errors, connection errors, and invalid input for every AI route.

The frontend displays appropriate fallback/error states when generation fails, rather than a blank or crashed page.

## Testing

StudyFlow uses Vitest. Current results:

```text
Test Files  13 passed (13)
Tests       61 passed (61)
```

Coverage:

| Metric | Overall | Components |
|---|---|---|
| Statements | 81.41% | 56.43% |
| Branches | 76.89% | 52.54% |
| Functions | 85.48% | 50.00% |
| Lines | 82.97% | 59.78% |

Covered areas include: settings storage & schema validation, all AI API routes (`chat`, `quiz`, `flashcards`, `study-pack`, `study-plan`, `summary`), study session context & storage, the workflow progress indicator, and the smooth custom cursor.

Run the test suite:

```bash
npm test
```

Run with coverage:

```bash
npm run test -- --coverage
```

## Accessibility and Performance

Latest Lighthouse audit (Incognito, production URL):

| Category | Score |
|---|---|
| Performance | 97 |
| Accessibility | 100 |
| Best Practices | 100 |
| SEO | 100 |

**No WCAG 2.1 AA violations.** Fixes made during the audit process:

- **Performance** (76 → 97): reduced stacked `backdrop-filter` layers and scoped `transition-all` to specific properties in the animated hero component, cutting main-thread Style & Layout cost.
- **Accessibility** (88 → 100): corrected insufficient text contrast ratios (WCAG 1.4.3) on secondary/label text across the landing page and workflow pages, expanded undersized interactive touch targets (WCAG 2.5.8) to a minimum 44×44px hit area without changing their visual size, and corrected non-sequential heading order on the homepage.

The workflow progress indicator was specifically tested at a 375px mobile viewport to confirm no horizontal overflow or label collision. The custom cursor is automatically disabled on touch devices, mobile widths (<768px), and portrait orientation so it never interferes with mobile interaction.

## Deployment

StudyFlow is deployed on Vercel, tracking the `main` branch for automatic production deployments.

Production URL: https://studyflow-umber-chi.vercel.app

Full deployment checklist, environment configuration, functional verification steps, and rollback procedure are documented in [`DEPLOYMENT.md`](./DEPLOYMENT.md).

## Known Limitations

- Study session state is stored entirely in browser localStorage — there is no account system or server-side persistence, so sessions do not sync across devices or browsers, and clearing browser storage clears the session.
- AI-generated content can vary between requests, and quality depends on the structure/clarity of the uploaded study material.
- The application currently focuses on a single core study workflow rather than supporting arbitrary document formats or multi-document sessions.
- The custom cursor is intentionally disabled on mobile and touch devices.

## Future Improvements

- Server-side/account-based session persistence for cross-device sync
- More advanced document parsing (PDF/image upload, not just pasted text)
- Long-term learning history and spaced-repetition-based personalization
- Additional quiz/question formats
- More detailed learning analytics
- Expanded automated keyboard-navigation test coverage

## Project Status

StudyFlow is a completed capstone project, deployed as a working production application, with passing tests, Lighthouse Performance ≥90, and zero WCAG AA violations.