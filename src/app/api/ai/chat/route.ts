import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const SYSTEM_PROMPT = `
You are the IdeaForge startup and manufacturing consultant. Your objective is to help entrepreneurs discover, configure, budget, and optimize startup ideas and manufacturing plants.

When asked questions, follow these rules:
1. Provide a professional, warm, and highly technical response.
2. Ask clarification questions if needed: industry sector (CleanTech, Tech, Retail, Food, SaaS), manufacturing complexity, budget limits, scale target, and primary business goals (fast payback, high margin, ESG compliance).
3. Generate detailed blueprint packages recommendations:
   - Eco-Friendly Manufacturing Blueprint ($499): IdeaForge Central Controller, 2x Production Line Sensor Nodes (Temperature/Throughput), 1x Automated Equipment Relay Switch, 1x Quality Assurance Telemetry Sensor.
   - Premium Manufacturing Setup ($1,299): IdeaForge Central Controller (Pro Edition), 4x Production Sensors & 2x Automated Calibrators, 1x AI Climate & Temperature Heat Venting Module, 1x High-Definition Assembly Line Monitor Cam, 1x Central Safety Shut-off Control Gateway.
   - Luxury Smart Plant Integration ($2,999): IdeaForge Central Gateway (Enterprise, offline redundant), 10x Production Line Sensors & 4x Calibrators, 2x AI Smart Thermal Regulators (Venting & Cooling), 2x Biometric Facility Entrance Access Nodes, 1x 2K Quality Inspection Monitor Camera, 3x Assembly Monitor cams, 1x Whole-Plant Grid Power Optimizer Logger, 1x Automated Safety Shut-off Material Feed Valve.
4. Calculate and clearly lay out:
   - Estimated initial capital requirements.
   - Expected raw materials supply chain.
   - ROI period in years (e.g. 2-3 years).
   - Step-by-step startup checks (e.g., Phase 1: Zoning & permits, Phase 2: Controller sync, Phase 3: Calibrating lines).
5. Format your answers beautifully in clear markdown. Use bullets and bold text. Keep response length moderate (2-4 paragraphs max).
`;

function getFallbackResponseText(message: string): string {
  const promptLower = message.toLowerCase();

  if (promptLower.includes("budget") || promptLower.includes("package") || promptLower.includes("cost") || promptLower.includes("starter") || promptLower.includes("recommend") || promptLower.includes("blueprint")) {
    return `Based on your query, here is my **IdeaForge Recommendation**:

### Recommended Suite: Premium Setup Blueprint ($1,299)
This package is our highest value option and represents the best fit for medium scale plants or custom packaging assembly.

*   **Included Hardware:** IdeaForge Pro Gateway, 4x Production Sensors, 2x Calibrators, 1x Heat Venting Module, 1x HD Assembly Line Monitor, and 1x Safety Gateway.
*   **Monthly Operating Savings Forecast:** ~$385.00 / month on processing efficiency and standby loads.
*   **Estimated Return on Investment:** 2.8 Year payback period.
*   **Implementation Priority:**
    1.  *Phase 1 (Day 1):* Set up central IdeaForge controller and link to security gateways.
    2.  *Phase 2 (Day 1):* Wire and calibrate high-temperature production sensors on line A.
    3.  *Phase 3 (Day 2):* Configure conveyor speed parameters for automated inventory count matching.

Would you like me to book our consultant Alex Smith to map this premium setup blueprint for you?`;
  } else if (promptLower.includes("energy") || promptLower.includes("electric") || promptLower.includes("bill") || promptLower.includes("savings") || promptLower.includes("extruder") || promptLower.includes("power") || promptLower.includes("heat")) {
    return `Here is how we can optimize your plant resource profile using **IdeaForge Feasibility Insights**:

*   **Extruder Thermal Setback:** We configure a automatic eco setback cycle (lowering extruder temperatures during off-shift hours). This shaves **15% off processing power usage**.
*   **Dynamic Conveyor matching:** Calibrating motor speed cycles with sensor supply load data shuts down conveyor belts under low input states.
*   **Safety cutoffs:** Placing automatic shut-off valves on raw chemical hoppers avoids spill leakage waste.

**Predicted Financial Metrics:**
*   *Monthly Savings:* **$385.00** (based on average baseline utility costs)
*   *Annual Conservation:* **$4,620.00 / year**
*   *Feasibility Score Increase:* Boosts your automation index score from **45 to 78 / 100**!`;
  } else if (promptLower.includes("maintenance") || promptLower.includes("warning") || promptLower.includes("calibration") || promptLower.includes("extruder") || promptLower.includes("molder") || promptLower.includes("capacity")) {
    return `### ⚠️ AI Feasibility & Calibration Warnings

Your **Plastic Extruder & Molder Node** has flagged a feed level of **12%**.

*   **Failure Forecast:** The AI predicts extruder feed depletion around **August 5th** (in roughly 12 days).
*   **Reasoning:** Hopper levels are under 15% and extruder motor load indicators show mechanical friction spikes inside screw feeder shafts, causing the system to draw elevated current.
*   **AI Recommendations:**
    1.  Refill hopper materials immediately to prevent dry run screw wear.
    2.  Spray high-temperature lubricant on feed screw gears.
    3.  Verify network parameters with the plant integration gateway to clear warning alerts.

*Click the 'Book New Audit' button on your dashboard to schedule Alex Smith for immediate calibration help.*`;
  } else {
    return `Hello! I am your IdeaForge startup and manufacturing consultant. 

To help me tailor the perfect setup for you, could you tell me a bit more about:
1.  What is your **industry sector** (CleanTech, Tech, Food, Retail, SaaS) and scale target?
2.  What is your **ideal budget** range?
3.  What are your top **priorities**? (e.g., ESG Compliance, Operating Margins, Startup Cost, or Complete Automation)

Once you provide these details, I can generate a tailored device recommendations catalog, ROI payback periods, and implementation checklists.`;
  }
}

export async function POST(req: Request) {
  let message = "";
  try {
    const body = await req.json();
    message = body.message || "";
    const history = body.history || [];

    if (!message) {
      return NextResponse.json({ error: "Missing query message." }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    const isPlaceholder = !apiKey || apiKey === "" || apiKey.includes("YourActualAPIKey") || apiKey.includes("placeholder");

    if (isPlaceholder) {
      const responseText = getFallbackResponseText(message);
      // Return simulated delay
      await new Promise((resolve) => setTimeout(resolve, 600));
      return NextResponse.json({ response: responseText });
    }

    // Initialize Gemini Client
    const ai = new GoogleGenerativeAI(apiKey);
    const model = ai.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: SYSTEM_PROMPT
    });

    // Gemini SDK requires history to start with a 'user' message.
    // We locate the first message sent by 'user' and slice the history starting from it.
    const firstUserIndex = history.findIndex((h: any) => h.sender === "user");
    const historyToUse = firstUserIndex !== -1 ? history.slice(firstUserIndex) : [];

    const chat = model.startChat({
      history: historyToUse.map((h: any) => ({
        role: h.sender === "user" ? "user" : "model",
        parts: [{ text: h.text }]
      }))
    });

    const result = await chat.sendMessage(message);
    const text = result.response.text();

    return NextResponse.json({ response: text });
  } catch (err: any) {
    console.error("AI API Error:", err);
    // If Gemini fails due to bad key or network, return fallback gracefully instead of returning 500 error block
    const fallbackText = getFallbackResponseText(message);
    return NextResponse.json({
      response: `*(Note: Simulated response since Gemini API key is inactive or offline)*\n\n${fallbackText}`
    });
  }
}
