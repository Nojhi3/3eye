# IdeaForge — AI Startup & Manufacturing Explorer

IdeaForge is a responsive Next.js application for exploring startup and manufacturing blueprints. It gives entrepreneurs a plant-planning workspace, consultants an audit workflow, and administrators an operations console. The application combines deterministic business logic for packages, orders, appointments, devices, and payback estimates with a Gemini-powered feasibility assistant.

Reference inspiration: [10000ideas.com](https://10000ideas.com) and [IdeaBrowser](https://ideabrowser.com).

## Current capabilities

- Role-based demo workspaces for entrepreneurs, consultants, and administrators
- Landing page, login, signup, password-reset, dashboards, profiles, packages, equipment, appointments, maintenance, AI assistant, technician, and admin screens
- Package purchase → appointment creation → consultant checklist → report submission → device provisioning workflow
- Recharts payback/energy visualizations and deterministic feasibility scores
- Gemini chat through a server-side Next.js Route Handler with configurable `GEMINI_MODEL`, validated history, safe fallback responses, and `/api/health`
- IndexedDB local persistence with automatic migration and localStorage backup for the current prototype
- Responsive dark operations-console UI with Framer Motion interactions and Lucide icons

## Architecture

![IdeaForge architecture and product flow](public/ideaforge_img.png)

The detailed architecture explanation is in [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md). The reusable AI coding specification is in [docs/MASTER_PROMPT.md](docs/MASTER_PROMPT.md).

### Main implementation areas

- `src/app/` — Next.js App Router pages and API Route Handlers
- `src/components/DashboardLayout.tsx` — shared authenticated dashboard shell
- `src/context/AppContext.tsx` — client-side domain state and business workflows
- `src/lib/local-db.ts` — IndexedDB adapter with localStorage migration/backup
- `src/lib/ai.ts` — Gemini prompt, input validation, history normalization, and fallback logic
- `src/app/api/ai/chat/route.ts` — Gemini server integration
- `src/app/api/health/route.ts` — safe provider configuration health check
- `tests/` — Vitest unit and API contract tests
- `scripts/gemini-smoke.mjs` — live provider smoke test

## AI choices

- **LLM/NLP:** Gemini for conversational feasibility analysis, blueprint recommendations, explanations, and maintenance summaries.
- **Recommendation engine:** transparent package and fallback rules in the prototype; these can later be replaced or augmented by retrieval-backed recommendations.
- **Predictive analytics:** deterministic energy/payback and maintenance heuristics currently; production ML should be introduced only after collecting labelled operational data.
- **RAG:** planned for approved regulations, supplier catalogs, and IdeaForge documentation with citations and document dates.
- **Computer vision, OCR, speech, and autonomous agents:** not currently implemented. Technician photo verification is presently a workflow placeholder.

## Local setup

Requirements: Node.js 18+ and npm.

```bash
npm install
npm run dev
```

Create `.env.local` for Gemini:

```env
GEMINI_API_KEY=your_key_here
GEMINI_MODEL=gemini-2.5-flash
```

The API key is server-only and must not use a `NEXT_PUBLIC_` prefix.

## QA and validation

```bash
npm run typecheck
npm run lint
npm test
npm run test:gemini
npm run build
npm run test:qa
```

The QA plan and manual acceptance checklist are in [docs/QA_PLAN.md](docs/QA_PLAN.md). The current automated suite covers chat validation, Gemini history construction, fallback routing, provider-path API behavior, and health endpoint contracts.

## Deployment

The project is configured for Vercel and has previously been deployed at [https://3eye-six.vercel.app/](https://3eye-six.vercel.app/). After merging the current branch, redeploy and add `GEMINI_API_KEY` (and optionally `GEMINI_MODEL`) to the hosting provider’s environment variables. Verify `/api/health` reports `configured: true` and test `/api/ai/chat` after deployment.

## Prototype boundary

This version uses browser-local IndexedDB rather than a hosted database. It is suitable for demonstration and local persistence, but production use still requires secure server sessions, server-side role authorization, a hosted database, payment handling, multi-user isolation, rate limiting, and persistent file storage.
