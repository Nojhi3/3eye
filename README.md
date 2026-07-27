# SmartNest - Intelligent Smart Home Platform

SmartNest is a complete, production-ready, AI-powered smart home automation platform designed to help homeowners discover, purchase, install, and maintain smart home environments. The platform integrates an interactive recommendations consultant, utility billing optimizer charts, predictive failure alerts, and a technician dispatch loop.

Live Application URL: https://3eye-six.vercel.app/
GitHub Repository URL: https://github.com/Nojhi3/3eye

---

## Technical Overview of the 7 Assessment Objectives

Below is the detailed breakdown of how each of the 7 objectives specified in the assessment guidelines was planned, engineered, tested, and deployed.

---

### Objective 1: Requirement Analysis and AI Justification

#### Problem Statement
Analyze the project requirements, identify the target users, define the core features and business logic flows, and determine where AI can add meaningful value to the application. Evaluate and justify the choice of AI engines (e.g. LLMs, machine learning, recommendation systems, NLP, or predictive analytics).

#### Implementation and Solution Details
We mapped out a complete product and manufacturing service startup ecosystem named SmartNest. This system integrates three distinct user types:
1. Homeowners (Consumers): Require package recommendations, installation scheduling, billing audits, and device diagnostics.
2. Technicians (Service Crew): Require field tickets, checklist logs, and diagnostic checklists to mount physical hardware.
3. Administrators (Managers): Require pricing control panels, staff rosters, and revenue flows.

We integrated three specific AI layers to solve these requirements:
* LLMs (Google Gemini 1.5 Flash): Powers the smart consultant to answer complex technical installation questions and parse natural language parameters.
* Recommendation Systems: Evaluates user room layouts, budgets, and priority fields to suggest optimized starter, premium, or luxury equipment packages.
* Predictive Analytics: Monitors device health statistics (battery drop thresholds, operating current variances) to predict failure timelines (e.g. flagging a Yale Deadbolt battery depletion warning) and prompt service dispatches.

Detailed flowcharts and ER schemas are documented in [smartnest_evaluation_report.md](file:///C:/Users/aksha/.gemini/antigravity-cli/brain/b7007bb2-eb94-415e-8331-892b1dfcf838/smartnest_evaluation_report.md) and [smartnest_system_documentation.md](file:///C:/Users/aksha/.gemini/antigravity-cli/brain/b7007bb2-eb94-415e-8331-892b1dfcf838/smartnest_system_documentation.md).

---

### Objective 2: Prompt Engineering

#### Problem Statement
Prepare a comprehensive master prompt that clearly describes the application, its features, user roles, database structure, workflows, AI capabilities, UI requirements, APIs, validations, security, and scalability.

#### Implementation and Solution Details
We compiled a system architecture prompt that is stored within the submission document. The prompt details the exact schema configurations, validation routines (React Hook Form + Zod), and dark theme aesthetics required for the AI assistant and local codebases.

The master prompt utilized is:
```text
You are a Senior Product Manager, Senior UI/UX Designer, Senior Software Architect, Senior Full Stack Engineer, and AI Engineer.
Build a complete Next.js 15, React 19, TypeScript, and TailwindCSS application named SmartNest. 

Core Requirements:
1. Interconnected Multi-Role Workspaces:
   - Homeowner: Dashboard view displaying active smart devices, a Recharts energy usage optimizer, and an AI chat assistant console. Can trigger installation packages and repair bookings.
   - Technician: Portal to view dispatched service orders, checklist sheets, completion logs, and photo validation checkouts.
   - Administrator: Console tracking user database directories, adjustments for package base pricing, and live revenue flow.
2. Shared State Synchronization:
   - Manage all data via a shared React Context provider persisting state in localStorage. 
   - Ensure role actions reflect dynamically: Admin package pricing adjustments must update the Homeowner catalogue, and Technician job completions must dynamically provision active smart devices in the client Homeowner's dashboard.
3. Chat Integration (Google Gemini SDK):
   - Create a POST api route at /api/ai/chat connecting to Google's gemini-1.5-flash model.
   - Clean/slice conversational history starting from the first "user" message to satisfy Gemini SDK validation constraints.
   - Implement a local offline simulated fallback that generates high-fidelity mock replies if the GEMINI_API_KEY is not supplied or fails due to network/authentication issues.
4. Design Aesthetics:
   - Modern dark theme styling (Slate-950 background) with fluid animations using Framer Motion (such as accordion drop-downs in FAQs).
   - Ensure the layout is fully responsive across mobile, tablet, and desktop viewports.
```

---

### Objective 3: UI/UX Design

#### Problem Statement
Define a modern, responsive, and visually appealing interface. Specify the design style, color palette, typography, navigation, layouts, and ensure mobile/tablet compatibility.

#### Implementation and Solution Details
We implemented a premium dark theme styling utilizing a slate palette:
* Color System: Default dark background (`#020617` / Slate-950) and white foreground (`#f8fafc` / Slate-50) forced via global CSS variables inside [globals.css](file:///D:/all_progs/teesriAakh/src/app/globals.css) to prevent light-mode browser system preference bleeds from compromising card transparency.
* Typography: Clean sans-serif layout (`Outfit` and system UI variables).
* Analytics: Rendered energy optimization forecasts in [dashboard/page.tsx](file:///D:/all_progs/teesriAakh/src/app/dashboard/page.tsx) using dual-gradient Recharts Area bars (`#barBefore` and `#barAfter`), opacity levels, and dark slate tooltip cards.
* Interactive Transitions: Handled accordion menus on the landing page [page.tsx](file:///D:/all_progs/teesriAakh/src/app/page.tsx) with Framer Motion (`AnimatePresence` and `motion.div` height transitions) to slide panels down fluidly.
* Layout: Fully responsive grid patterns and collapsible sidebar drawer elements declared inside [DashboardLayout.tsx](file:///D:/all_progs/teesriAakh/src/components/DashboardLayout.tsx).

---

### Objective 4: AI-Assisted Development

#### Problem Statement
Build the application using AI coding tools. Continue refining prompts and regenerating code until the application meets the expected quality, accessibility, compile, and performance metrics.

#### Implementation and Solution Details
We used Google Antigravity and Gemini/Claude models to coordinate directory creation, script generation, and Git tracking:
* Iterated on visual feedback (replacing static placeholder shapes in the landing page with user-provided dashboard images).
* Resolved asynchronous state overwrite closure bugs and checked TypeScript compile checks via server background build tasks (`npm run build`) before committing files.
* Maintained Git history tracking with clean commits for major milestones.

---

### Objective 5: Application Development

#### Problem Statement
Deliver a complete application with all required pages, authentication, dashboards, inner screens, forms, business logic, navigation, database integration, and AI-powered features.

#### Implementation and Solution Details
We developed a complete file matrix:
1. State Engine & Database Simulation: Created [AppContext.tsx](file:///D:/all_progs/teesriAakh/src/context/AppContext.tsx) to simulate a relational database model in browser `localStorage`.
2. Interconnected Roles & Workspaces:
   * Homeowner Dashboard: [dashboard/page.tsx](file:///D:/all_progs/teesriAakh/src/app/dashboard/page.tsx) (Energy Optimizer calculations, Recharts graphs).
   * Device Management Console: [devices/page.tsx](file:///D:/all_progs/teesriAakh/src/app/devices/page.tsx) (active control toggles, custom Matter registration modals).
   * Appointment Scheduler: [appointments/page.tsx](file:///D:/all_progs/teesriAakh/src/app/appointments/page.tsx) (rescheduling date logic, technician assignments, install lists).
   * Maintenance Console: [maintenance/page.tsx](file:///D:/all_progs/teesriAakh/src/app/maintenance/page.tsx) (device failure logs, battery alerts).
   * Administrator Portal: [admin/page.tsx](file:///D:/all_progs/teesriAakh/src/app/admin/page.tsx) (staff directories, global price adjusters, total revenue analytics).
   * Technician Panel: [technician/page.tsx](file:///D:/all_progs/teesriAakh/src/app/technician/page.tsx) (onsite repair checklist switches, diagnostics notes).
3. Auth Simulation Suite: Created login portals [login/page.tsx](file:///D:/all_progs/teesriAakh/src/app/auth/login/page.tsx), signup [signup/page.tsx](file:///D:/all_progs/teesriAakh/src/app/auth/signup/page.tsx), and recovery [forgot/page.tsx](file:///D:/all_progs/teesriAakh/src/app/auth/forgot/page.tsx) with quick-access login buttons.
4. AI Chat Assistant Console: Created [ai-assistant/page.tsx](file:///D:/all_progs/teesriAakh/src/app/ai-assistant/page.tsx) with prompt quick-clicks, referencing the chat router at [route.ts](file:///D:/all_progs/teesriAakh/src/app/api/ai/chat/route.ts).

---

### Objective 6: Testing and Quality Assurance

#### Problem Statement
Thoroughly test the application. Include functional testing, UI/UX validation, form validation, API testing, AI feature testing, and cross-browser compatibility.

#### Implementation and Solution Details
We performed intensive testing and resolved three key bugs:
* Chat History Closure Bug: When a homeowner clicked "Send", the async fetch callback captured the old state of `chatHistory` inside the local scope, causing the AI response to overwrite the user's message. We resolved this inside [AppContext.tsx](file:///D:/all_progs/teesriAakh/src/context/AppContext.tsx#L827-L835) by updating `addChatMessage` to use React's functional updater format `setChatHistory((prev) => [...prev, newMessage])`.
* Gemini SDK History Validation: The Google Gemini API throws an error if chat history arrays begin with a `"model"` role. Since our chat begins with an AI welcome message, the API rejected requests. We resolved this in [route.ts](file:///D:/all_progs/teesriAakh/src/app/api/ai/chat/route.ts#L107-L113) by slicing the history to begin with the first `"user"` message.
* Fail-Safe Fallback: Verified that if the API key is not set or Google's servers are unreachable, the server catches the exception and returns mock predictions so the user's chat never crashes.
* Layout Responsiveness & Zod Validations: Checked viewports on Chrome DevTools and integrated Zod schema parsers for form inputs.

---

### Objective 7: Deployment

#### Problem Statement
Run the application locally to verify it functions, then deploy the code to a hosting platform (such as Vercel) and ensure the live version is fully operational.

#### Implementation and Solution Details
* Local Run: Verified build checks compile without errors using `npm run build`. Dev server starts at `http://localhost:3000`.
* Production Host: Deployed the Next.js bundle to Vercel at https://3eye-six.vercel.app/. 
* Environment Variable Hook: Configured `GEMINI_API_KEY` on Vercel's Environment Variables dashboard, mapping live endpoints.
