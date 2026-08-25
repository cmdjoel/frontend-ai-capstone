# StudyFlow — Deployment Checklist

## 1. Production Deployment

| Item | Status |
|---|---|
| Live production URL | https://studyflow-umber-chi.vercel.app |
| Hosting platform | Vercel |
| Production branch | `main` |
| Branch tracking configured correctly (auto-deploys on push) | ✅ Verified |
| Latest production commit | `cf53a31` |
| Deployment date | `25th August 2026` |
| Deployed by | `Joel Sunil` |

## 2. Environment & Configuration

| Item | Status |
|---|---|
| Environment variables set in Vercel (AI provider API key, etc.) | ✅ Confirmed present in Vercel → Settings → Environment Variables |
| No secrets committed to the repository | ✅ Confirmed (`.env.local` is gitignored) |
| Node.js version compatible with Vercel's build environment | ✅ |
| `npm run build` completes successfully with no errors | ✅ Verified locally before deploy |

## 3. Functional Verification (manual smoke test on production URL)

| Page/Flow | Verified |
|---|---|
| Landing page (`/`) | ✅ |
| Upload Notes (`/upload`) | ✅ |
| Study Pack (`/study-pack`) | ✅ |
| Summary (`/summary`) | ✅ |
| Flashcards (`/flashcards`) | ✅ |
| AI Tutor / Chat (`/chat`) | ✅ |
| Quiz (`/quiz`) | ✅ |
| Quiz Results (`/quiz/results`) | ✅ |
| Weak Areas (`/weak-areas`) | ✅ |
| Study Plan (`/study-plan`) | ✅ |
| Settings (`/settings`) | ✅ |
| Health check (`/health`, hidden from nav but reachable) | ✅ |
| Smooth custom cursor (desktop) | ✅ |
| Mobile workflow progress indicator (375px, no overflow) | ✅ |
| Settings preferences actually affect AI output (difficulty, study hours, exam date, explanation detail) | ✅ |

## 4. Safe Failure & Error States

| Item | Status |
|---|---|
| `/health` route returns graceful fallback UI on fetch failure (try/catch implemented) | ✅ |
| API routes (`/api/chat`, `/api/quiz`, `/api/summary`, `/api/study-plan`, `/api/study-pack`, `/api/flashcards`) handle AI provider errors without crashing the page | ✅ — covered by route tests (rate limit / connection error paths) |
| Invalid or missing settings (e.g. missing exam date) do not break study plan generation | ✅ |
| Client-side session state absence (no upload yet) does not crash workflow pages | ✅ |
| Streaming chat handles connection interruption without leaving the UI stuck | ✅ |

## 5. Monitoring / Post-Deploy Verification

| Item | Status |
|---|---|
| Vercel deployment marked "Ready" and aliased to production domain | ✅ Confirmed in Vercel Deployments tab |
| Lighthouse Performance ≥85 | ✅ 97 |
| Lighthouse Accessibility — no WCAG AA violations | ✅ 100, 0 violations |
| Lighthouse Best Practices / SEO | ✅ 100 / 100 |
| No console errors on production homepage load | ✅ Manually checked in DevTools |
| Test suite passing at time of deploy | ✅ 61/61 tests passing, 13/13 test files |

## 6. Rollback Plan

StudyFlow is deployed on Vercel, which retains all previous deployments and their build artifacts.

**To roll back:**
1. Go to the Vercel dashboard → Deployments tab
2. Locate the last known-good deployment (identifiable by commit message and hash)
3. Click the `⋯` menu on that deployment → **"Promote to Production"**
4. This immediately re-points the production domain to the previous working build — no rebuild, no downtime, typically live within seconds

**Known-good rollback points (as of this submission):**
- `cf53a31` — WCAG AA accessibility fixes (contrast, touch targets, heading order)
- `4f30e7a` — Lighthouse performance fix (backdrop-blur reduction)
- `371f4dc` — last stable pre-perf-work deployment

No database or migration rollback is required — StudyFlow's study session state is stored entirely client-side (localStorage), so a rollback never causes data loss or requires data migration.

## 7. Sign-off

| Role | Name | Date |
|---|---|---|
| Developer | `Joel Sunil` | `25th August 2026` |

**Deployment confirmed intentional and verified functional in production.**