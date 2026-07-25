# SmartNest - Intelligent Smart Home Platform

SmartNest is a complete, production-ready, AI-powered smart home automation platform designed to help homeowners discover, purchase, install, and maintain smart home environments. The platform integrates a recommendation engine, utility billing optimizer charts, predictive failure alerts, and a technician dispatch loop.

Live Application URL: https://3eye-six.vercel.app/
GitHub Repository URL: <insert-github-repo-url>

---

## Architecture and Core Workflow

SmartNest is built as an interactive multi-role ecosystem using Next.js, React, TypeScript, and TailwindCSS. The system coordinates data flow dynamically across three specific user roles using a synchronized global state provider:

1. Homeowners: Access the smart home console to monitor connected hardware, input monthly utility metrics for automated billing audits, and chat with the AI consultant. If the system flags a low battery alert (e.g. Yale Deadbolt battery drops to 12%), the homeowner can book service calls.
2. Technicians: View active field dispatch jobs, follow customized checklists for specific smart package installations, upload completion remarks, and close orders. Closing an install order dynamically provisions the devices into the client homeowner's active console.
3. Administrators: Manage global service inventories, adjust package base pricing, view staff rosters, and monitor live revenue dashboards.

### State Management
Data persistence is handled on the client side using a centralized global React Context provider (AppContext.tsx) backed by browser localStorage. This allows instant synchronization across workspaces (e.g., changing package pricing as an Admin immediately updates the homeowner catalog, and technicians completing setup checklists immediately populates the homeowner's active device list).

---

## Technical Stack

* Core Framework: Next.js 15 (App Router), React 19, TypeScript
* Styling and Animations: TailwindCSS (v4), Framer Motion
* Analytics and Charts: Recharts
* Form and Schema Validation: React Hook Form, Zod, Hookform Resolvers
* AI Integration: Google Gemini SDK (@google/generative-ai)
* State and Persistence: Global React Context with localStorage caching

---

## Installation and Local Running Guide

1. Clone the repository to your local system.
2. Install all package dependencies (utilizing legacy peer flags due to React 19 charting support):
   ```bash
   npm install --legacy-peer-deps
   ```
3. Configure your API key. Create a file named `.env.local` in the project root:
   ```env
   GEMINI_API_KEY=your_actual_gemini_api_key
   ```
   Note: If the key is omitted or contains a template placeholder, the API route automatically transitions into an offline simulation fallback, serving smart mock answers so all features remain testable.
4. Start the developer server:
   ```bash
   npm run dev
   ```
5. Open your browser and navigate to http://localhost:3000

---

## Quick Demo Login Personas

To test the role-based coordination, log in using the demo quick-access buttons on the login screen or enter these credentials:
* Homeowner Persona:
  * Email: homeowner@smartnest.ai
  * Password: password
* Technician Persona:
  * Email: tech@smartnest.ai
  * Password: password
* Administrator Persona:
  * Email: admin@smartnest.ai
  * Password: password

---

## AI Implementation and Workflow

1. AI Smart Home Consultant Chatbot: Hosted under /api/ai/chat, the router communicates with Gemini 1.5 Flash. It parses the incoming conversation history, filters out initial system greetings (Gemini API requires chat history to begin with a user message), and generates contextual installation plans, pricing estimates, and energy payback projections.
2. Fail-Safe Offline Fallback: If network drops occur, or if the API key is not configured, the endpoint handles the exception gracefully, returning detailed mock responses rather than returning system crash status codes.

---

## Testing and Quality Assurance

* Functional End-to-End Tests: Verified key-action synchronization across roles (e.g. buying a package -> booking a setup -> technician checklist completion -> homeowner device registration).
* UI and Responsiveness: Tested layouts across mobile, tablet, and desktop viewports using Chrome DevTools. Responsive flex layouts and conditional mobile drawer navigation are styled using Tailwind.
* Form Validations: Handled input fields, login screens, profiles, and billing metrics utilizing React Hook Form paired with Zod schemas.
* API Endpoint Tests: Validated POST requests, JSON parsers, and chat history payloads for /api/ai/chat.
