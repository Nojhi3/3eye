# Mind-map generation prompt

Paste this into an image-generation or diagram-generation tool:

```text
Create a clean professional product architecture mind map for “IdeaForge — AI Startup & Manufacturing Explorer”. Use a wide 16:9 canvas, dark navy background, high-contrast white text, indigo primary branches, emerald success branches, amber warning branches, and thin glowing connectors. Keep labels short, legible, and free of spelling errors. Do not add decorative people or unrelated technology logos.

Center node: “IdeaForge platform”.

Branch 1 — Users and roles:
- Entrepreneur: plant profile, package catalog, orders, dashboard, equipment, appointments, maintenance, AI planner
- Consultant: assigned audits, checklist, notes, photos, maintenance reports
- Admin: users, packages, pricing, revenue, operations

Branch 2 — Core product flow:
- Landing page
- Signup/login
- Plant registration
- Blueprint/package selection
- Order created
- Feasibility audit scheduled
- Consultant completes checklist
- Devices provisioned
- Maintenance and dashboard updated

Branch 3 — Frontend architecture:
- Next.js App Router
- Responsive pages
- Shared DashboardLayout
- AppContext state layer
- Forms and validation
- Recharts analytics
- localStorage demo persistence

Branch 4 — Backend and integrations:
- Next.js Route Handlers
- POST /api/ai/chat
- GET /api/health
- Gemini server-side API
- Environment secrets
- Future database and secure sessions

Branch 5 — AI capabilities:
- LLM feasibility conversation
- Blueprint recommendations
- Capital/payback explanation
- Maintenance warning summaries
- Local fallback mode
- Future RAG over regulations and supplier catalogs
- Future ML maintenance prediction

Branch 6 — Quality and delivery:
- Unit tests
- API tests
- End-to-end tests
- Accessibility checks
- Responsive checks
- Build and lint
- Vercel deployment

Add a small legend: solid nodes = implemented now; dashed nodes = future roadmap. Make the hierarchy balanced, avoid overlapping text, and ensure the result reads like a polished SaaS architecture diagram suitable for a project assessment report.
```
