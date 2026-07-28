import { NextResponse } from "next/server";
import { getGeminiModel, isConfiguredApiKey } from "@/lib/ai";

export const runtime = "nodejs";

export async function GET() {
  const configured = isConfiguredApiKey(process.env.GEMINI_API_KEY);

  return NextResponse.json({
    ok: true,
    service: "ideaforge",
    gemini: {
      configured,
      model: getGeminiModel(),
      provider: "Google Gen AI SDK",
    },
    timestamp: new Date().toISOString(),
  });
}
