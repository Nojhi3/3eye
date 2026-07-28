import { describe, expect, it } from "vitest";
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
});
