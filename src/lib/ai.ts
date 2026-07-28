export type ChatSender = "user" | "ai";

export interface ChatHistoryItem {
  sender: ChatSender;
  text: string;
}

export const DEFAULT_GEMINI_MODEL = "gemini-2.5-flash";

export const SYSTEM_PROMPT = `
You are the IdeaForge startup and manufacturing consultant. Help entrepreneurs discover, configure, budget, and optimize startup ideas and manufacturing plants.

Rules:
1. Be professional, warm, practical, and technically precise. State assumptions and label estimates as estimates.
2. Ask for missing context such as sector, manufacturing complexity, budget, target scale, location, payback goals, margin goals, and ESG requirements.
3. Recommend one of these blueprint packages when relevant:
   - Eco-Friendly Manufacturing Blueprint ($499)
   - Premium Manufacturing Setup ($1,299)
   - Luxury Smart Plant Integration ($2,999)
4. Explain capital requirements, raw-material supply-chain considerations, estimated ROI/payback, risks, and phased implementation checks.
5. Never claim to have completed a purchase, appointment, inspection, legal approval, safety certification, or financial guarantee. Direct the user to the relevant IdeaForge workflow when an action is needed.
6. Keep responses moderate in length and format them in readable Markdown with headings and bullets.
`;

export function isConfiguredApiKey(apiKey: string | undefined): apiKey is string {
  return Boolean(
    apiKey &&
      apiKey.trim() &&
      !/placeholder|youractualapikey|your_api_key/i.test(apiKey),
  );
}

export function getGeminiModel(model = process.env.GEMINI_MODEL): string {
  return model?.trim() || DEFAULT_GEMINI_MODEL;
}

export function validateChatInput(
  message: unknown,
  history: unknown,
): { message: string; history: ChatHistoryItem[] } | null {
  if (typeof message !== "string") return null;

  const normalizedMessage = message.trim();
  if (!normalizedMessage || normalizedMessage.length > 4000) return null;

  const rawHistory = Array.isArray(history) ? history : [];
  const normalizedHistory = rawHistory
    .filter((item): item is ChatHistoryItem => {
      if (!item || typeof item !== "object") return false;
      const candidate = item as Record<string, unknown>;
      return (
        (candidate.sender === "user" || candidate.sender === "ai") &&
        typeof candidate.text === "string" &&
        candidate.text.trim().length > 0
      );
    })
    .slice(-30)
    .map((item) => ({ sender: item.sender, text: item.text.trim().slice(0, 4000) }));

  return { message: normalizedMessage, history: normalizedHistory };
}

export function buildGeminiContents(history: ChatHistoryItem[], message: string) {
  const firstUserIndex = history.findIndex((item) => item.sender === "user");
  const usableHistory = firstUserIndex >= 0 ? history.slice(firstUserIndex) : [];
  const contents = usableHistory.map((item) => ({
    role: item.sender === "user" ? ("user" as const) : ("model" as const),
    parts: [{ text: item.text }],
  }));

  const last = contents.at(-1);
  if (!last || last.role !== "user" || last.parts[0]?.text !== message) {
    contents.push({ role: "user" as const, parts: [{ text: message }] });
  }

  return contents;
}

export function getFallbackResponseText(message: string): string {
  const promptLower = message.toLowerCase();

  if (/(budget|package|cost|starter|recommend|blueprint)/.test(promptLower)) {
    return `Based on your query, here is my **IdeaForge Recommendation**:

### Recommended Suite: Premium Setup Blueprint ($1,299)
This is a practical fit for a medium-scale plant or custom packaging assembly.

* **Included hardware:** Pro Gateway, four production sensors, two calibrators, heat-venting module, HD assembly-line monitor, and safety gateway.
* **Estimated payback:** 2.8 years, subject to your actual utility costs and production volume.
* **Implementation:** configure the controller, calibrate line sensors, then match conveyor speed to throughput.

Would you like to schedule a feasibility audit for this blueprint?`;
  }

  if (/(energy|electric|bill|savings|power|heat)/.test(promptLower)) {
    return `Here is an **IdeaForge Feasibility Insight**:

* Schedule extruder temperature setbacks during off-shift hours.
* Match conveyor cycles to sensor throughput.
* Add automatic safety cutoffs to raw-material feed lines.

The prototype estimates roughly 15–28% utility savings, but an audit is needed before treating that as a commitment.`;
  }

  if (/(maintenance|warning|calibration|extruder|molder|capacity)/.test(promptLower)) {
    return `### Feasibility and Calibration Warning

The seeded prototype data shows a low feed-capacity warning for the Plastic Extruder & Molder Node. Refill the hopper, inspect feed-screw friction, and book a consultant audit before restarting production.`;
  }

  return `Hello! I am your IdeaForge startup and manufacturing consultant.

Tell me your industry sector, target scale, budget range, and top priority—such as payback speed, margin, ESG compliance, or automation—and I can suggest a blueprint with estimated costs and an implementation checklist.`;
}
