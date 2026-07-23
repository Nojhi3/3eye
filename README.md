# SmartNest AI - Intelligent Smart Home Platform

SmartNest AI is a complete, production-ready, AI-powered smart home automation platform. It leverages Google Gemini AI models to help homeowners discover, simulate, install, and maintain smart home devices.

Unlike traditional smart home providers, **SmartNest AI** provides:
1.  **AI Smart Home Consultant:** Interactive chatbot audits that suggest custom hardware packages based on house size, room counts, budgets, and family priorities.
2.  **AI Energy Optimizer:** Model utility metrics (electric bills, active appliances) and generate Recharts comparisons showing shaven load projections.
3.  **AI Predictive Maintenance:** Predict device failures, warn homeowners of low battery statuses (e.g., Yale deadbolt at 12%), and enable certified technician dispatches.
4.  **Role-Based Interconnected Workspaces:** Clean dashboard views for **Homeowners** (overview, devices, calendar setup), **Technicians** (assigned job lists, mounting checklists, diagnostics checkouts), and **Administrators** (user registry, package specs, staffing assignments).

---

## 🛠️ Technology Stack

*   **Core:** Next.js 15 (App Router), React 19, TypeScript
*   **Styling & FX:** TailwindCSS (v4), Framer Motion
*   **Analytics:** Recharts
*   **Form & Validation:** React Hook Form, Zod, Hookform Resolvers
*   **AI Integration:** Google Gemini SDK (`@google/generative-ai`)
*   **State & DB:** Global React Context (`localStorage` persistence)

---

## 🚀 Running Locally

1.  Clone the repository files to your local environment.
2.  Install dependencies (using the legacy peer deps flag due to React 19 chart package syncs):
    ```bash
    npm install --legacy-peer-deps
    ```
3.  Set up your Google Gemini API key inside `.env.local` (Optional - a smart mock chat engine executes automatically if empty):
    ```env
    GEMINI_API_KEY=your-gemini-api-key-here
    ```
4.  Launch the developer server:
    ```bash
    npm run dev
    ```
5.  Open `http://localhost:3000` inside your browser.

---

## 👥 Demo Quick Login Personas

For testing or presenting to stakeholders, we have embedded **Demo Quick Login** triggers on the login screen:
*   **Homeowner:** Logs in as *John Doe* (`homeowner@smartnest.ai`, password: `password`). Accesses device controls, booking sheets, and energy simulations.
*   **Technician:** Logs in as *Alex Smith* (`tech@smartnest.ai`, password: `password`). Accesses mounting checklists, diagnostic note uploads, and job checkouts.
*   **Administrator:** Logs in as *Sarah Jenkins* (`admin@smartnest.ai`, password: `password`). Accesses user directories, package prices, and dispatch assignments.

*Note: Completing jobs as a Technician automatically provisions smart deadbolts and bridges into the corresponding Homeowner's device directory.*

---

## 📁 System Folder Structure

```
├── public/                 # Static SVGs, icon layers
├── src/
│   ├── app/                # Next.js Pages & REST API routes
│   │   ├── api/chat/       # Gemini AI router (with fallback mock loops)
│   │   ├── auth/           # Login, Signup, Forgot reset
│   │   ├── admin/          # Admin KPI & table matrices
│   │   ├── appointments/   # Installations booking sheets
│   │   ├── dashboard/      # Homeowner analytics charts
│   │   ├── devices/        # Telemetry toggles, delete & add
│   │   ├── maintenance/    # Predictive warning cards, tech checkout logs
│   │   ├── ai-assistant/   # Conversational Chat Console
│   │   ├── profile/        # Credentials edit forms, SMS alerts toggles
│   │   └── technician/     # Technician onsite checklists & diagnostic uploads
│   ├── components/         # Dashboard layout sidebar & TopNav switchers
│   └── context/            # Global AppContext database state
```

---

## 📄 Technical System Documentation
For deep-dive architecture layouts, database ER diagrams, API schemas, testing plans, and deployment checklists, view the [smartnest_system_documentation.md](file:///C:/Users/aksha/.gemini/antigravity-cli/brain/b7007bb2-eb94-415e-8331-892b1dfcf838/smartnest_system_documentation.md) artifact.
