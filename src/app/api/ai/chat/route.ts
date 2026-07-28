import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";
import {
  buildGeminiContents,
  getFallbackResponseText,
  getGeminiModel,
  isConfiguredApiKey,
  SYSTEM_PROMPT,
  validateChatInput,
} from "@/lib/ai";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let message = "";

  try {
    const body: unknown = await req.json();
    const candidate = body && typeof body === "object" ? body as Record<string, unknown> : {};
    const input = validateChatInput(candidate.message, candidate.history);

    if (!input) {
      return NextResponse.json(
        { error: "Message is required and must be between 1 and 4000 characters." },
        { status: 400 },
      );
    }

    message = input.message;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!isConfiguredApiKey(apiKey)) {
      await new Promise((resolve) => setTimeout(resolve, 250));
      return NextResponse.json({ response: getFallbackResponseText(message), mode: "fallback" });
    }

    const ai = new GoogleGenAI({ apiKey });
    const result = await ai.models.generateContent({
      model: getGeminiModel(),
      contents: buildGeminiContents(input.history, message),
      config: { systemInstruction: SYSTEM_PROMPT },
    });

    const responseText = result.text?.trim();
    if (!responseText) {
      throw new Error("Gemini returned an empty response.");
    }

    return NextResponse.json({ response: responseText, mode: "gemini", model: getGeminiModel() });
  } catch (error) {
    console.error("AI API Error:", error);
    return NextResponse.json(
      {
        response: `*(Gemini is temporarily unavailable; showing the local safety fallback.)*\n\n${getFallbackResponseText(message || "")}`,
        mode: "fallback",
      },
      { status: 200 },
    );
  }
}
