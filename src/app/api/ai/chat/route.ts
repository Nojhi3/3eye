import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const SYSTEM_PROMPT = `
You are the SmartNest home automation consultant. Your objective is to help homeowners discover, configure, install, and optimize smart devices.

When asked questions, follow these rules:
1. Provide a professional, warm, and highly technical response.
2. Ask clarification questions if needed: house type (single family, apartment), number of rooms, budget, family size, existing appliances, and main priorities (energy savings, security, comfort).
3. Generate detailed automation packages recommendations:
   - Starter Suite ($499): Hub, 2x bulbs, 1x energy plugs, motion sensor.
   - Premium Suite ($1,299): Pro Hub, 4x bulbs, dimmer switches, multi-zone thermostat, video deadbolt, ring doorbell, camera. (Best value)
   - Luxury Haven ($2,999): Enterprise Hub, 10x bulbs, multi-zone climate syncer, biometric deadbolts, doorbell pro, 3x cameras, whole-home energy meter, leak detector valve.
4. Calculate and clearly lay out:
   - Estimated monthly savings ($30 - $80 depending on bill).
   - Payback period in years (e.g. 2-3 years).
   - Priority of implementation (e.g. Phase 1: Security deadbolt, Phase 2: Climate setback, Phase 3: Ambient scenes).
5. Format your answers beautifully in clear markdown. Use bullets and bold text. Keep response length moderate (2-4 paragraphs max).
`;

export async function POST(req: Request) {
  try {
    const { message, history } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Missing query message." }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      // SMART FALLBACK SIMULATION: If API Key is missing, generate high-fidelity response locally
      const promptLower = message.toLowerCase();
      let responseText = "";

      if (promptLower.includes("budget") || promptLower.includes("package") || promptLower.includes("cost") || promptLower.includes("starter") || promptLower.includes("recommend")) {
        responseText = `Based on your query, here is my **SmartNest Recommendation**:

### Recommended Suite: Premium Automation Package ($1,299)
This package is our highest value option and represents the best fit for medium family homes.

*   **Included Hardware:** SmartNest Pro Hub, 4x RGBW Energy Bulbs, Smart Thermostat (Multi-zone), Yale Deadbolt with keypad, Ring Doorbell Camera, and 1x Outdoor Floodlight.
*   **Monthly Savings Forecast:** ~$38.50 / month on cooling and active standby loads.
*   **Estimated Return on Investment:** 2.8 Year payback period.
*   **Implementation Priority:**
    1.  *Phase 1 (Day 1):* Mount Yale Deadbolt and Ring Doorbell to lock structural entrypoints.
    2.  *Phase 2 (Day 1):* Calibrate Nest Thermostat and link to central Zigbee bridge.
    3.  *Phase 3 (Day 2):* Configure motion-activated corridor lighting rules.

Would you like me to book our technician Alex Smith to mount this premium package for you?`;
      } else if (promptLower.includes("energy") || promptLower.includes("electric") || promptLower.includes("bill") || promptLower.includes("savings") || promptLower.includes("thermostat")) {
        responseText = `Here is how we can optimize your energy load profile using **SmartNest Energy Insights**:

*   **Thermostatic Setback:** We configure a 4°F setback (e.g. 78°F in summer cooling hours, 68°F in winter heating hours) during 'Away' statuses triggered by mobile geofencing. This shaves **15% off heating/cooling bills**.
*   **Standby Shedding:** Placing smart plugs on home entertainment loops and standby appliances lets us auto-shutdown vampire loads between 12 AM and 6 AM.
*   **Ambient Dims:** Setting Phillips Hue lightbars to dim to 40% after 9 PM saves bulb lifespan and lowers bulb energy consumption.

**Predicted Financial Metrics:**
*   *Monthly Savings:* **$38.50** (based on average $180 baseline bills)
*   *Annual Conservation:* **$462.00 / year**
*   *Energy Score Increase:* Boosts your automation health score from **45 to 78 / 100**!`;
      } else if (promptLower.includes("maintenance") || promptLower.includes("deadbolt") || promptLower.includes("lock") || promptLower.includes("battery") || promptLower.includes("warning")) {
        responseText = `### ⚠️ AI Predictive Maintenance Diagnostics

Your **Yale Assure Lock 2** has flagged a battery level of **12%**.

*   **Failure Forecast:** The AI predicts complete motor depletion around **August 5th** (in roughly 12 days).
*   **Reasoning:** Battery cells are under 1.1V and latch diagnostics indicate mechanical friction inside the lock strike plate, causing the motor to pull twice the normal baseline current.
*   **AI Recommendations:**
    1.  Swap all 4x AA batteries with new alkaline cells immediately.
    2.  Spray dry PTFE lubricant on latch friction plates.
    3.  Verify connection parameters with the Phillips Hue bridge to prevent signal search loops.

*Click the 'Dispatch Technician' button on your dashboard to schedule Alex Smith for immediate service.*`;
      } else {
        responseText = `Hello! I am your SmartNest home automation consultant. 

To help me tailor the perfect setup for you, could you tell me a bit more about:
1.  What is your **house type** (Single Family, Apartment, or Condo) and number of **rooms**?
2.  What is your **ideal budget** range?
3.  What are your top **priorities**? (e.g., Security, Energy Savings, Comfort, or Luxury Automation)

Once you provide these details, I can generate a tailored device recommendations catalog, monthly utility payback periods, and setup priorities.`;
      }

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

    const chat = model.startChat({
      history: history
        ? history.map((h: any) => ({
            role: h.sender === "user" ? "user" : "model",
            parts: [{ text: h.text }]
          }))
        : []
    });

    const result = await chat.sendMessage(message);
    const text = result.response.text();

    return NextResponse.json({ response: text });
  } catch (err: any) {
    console.error("AI API Error:", err);
    return NextResponse.json(
      { error: "Error communicating with AI engine: " + err.message },
      { status: 500 }
    );
  }
}
