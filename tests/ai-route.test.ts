import { describe, expect, it, vi } from "vitest";

const generateContent = vi.fn().mockResolvedValue({ text: "Gemini test response" });
vi.mock("@google/genai", () => ({
  GoogleGenAI: class {
    models = { generateContent };
  },
}));

import { GET } from "@/app/api/health/route";
import { POST } from "@/app/api/ai/chat/route";

describe("AI health endpoint", () => {
  it("reports provider configuration without exposing the API key", async () => {
    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(body.gemini).not.toHaveProperty("apiKey");
    expect(typeof body.gemini.model).toBe("string");
  });
});

describe("AI chat route input contract", () => {
  it("returns a 400 response for missing messages", async () => {
    const response = await POST(
      new Request("http://localhost/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ history: [] }),
      }),
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({ error: expect.any(String) });
  });

  it("uses Gemini when a server key is configured", async () => {
    process.env.GEMINI_API_KEY = "test-key";

    const response = await POST(
      new Request("http://localhost/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: "Suggest a manufacturing blueprint", history: [] }),
      }),
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toMatchObject({ response: "Gemini test response", mode: "gemini" });
    expect(generateContent).toHaveBeenCalledOnce();
  });
});
