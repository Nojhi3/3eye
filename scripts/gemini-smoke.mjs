import fs from "node:fs";
import { GoogleGenAI } from "@google/genai";

function loadLocalEnv() {
  for (const filename of [".env.local", ".env"]) {
    if (!fs.existsSync(filename)) continue;
    for (const line of fs.readFileSync(filename, "utf8").split(/\r?\n/)) {
      const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*["']?(.*?)["']?\s*$/);
      if (match && !process.env[match[1]]) process.env[match[1]] = match[2];
    }
  }
}

loadLocalEnv();

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey || /placeholder|youractualapikey|your_api_key/i.test(apiKey)) {
  console.error("Gemini smoke test skipped: GEMINI_API_KEY is missing or placeholder.");
  process.exit(2);
}

const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
try {
  const ai = new GoogleGenAI({ apiKey });
  const result = await ai.models.generateContent({
    model,
    contents: "Reply with exactly: IdeaForge Gemini smoke test passed.",
  });
  const text = result.text?.trim() || "";
  if (!text) throw new Error("The provider returned an empty response.");
  console.log(`Gemini smoke test passed using ${model}. Response length: ${text.length}.`);
} catch (error) {
  console.error(`Gemini smoke test failed for ${model}:`, error instanceof Error ? error.message : "Unknown provider error");
  process.exit(1);
}
