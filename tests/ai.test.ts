import { describe, expect, it } from "vitest";
import {
  buildGeminiContents,
  getFallbackResponseText,
  getGeminiModel,
  isConfiguredApiKey,
  validateChatInput,
} from "@/lib/ai";

describe("AI input and provider helpers", () => {
  it("rejects missing, blank, and oversized messages", () => {
    expect(validateChatInput(undefined, [])).toBeNull();
    expect(validateChatInput("   ", [])).toBeNull();
    expect(validateChatInput("a".repeat(4001), [])).toBeNull();
  });

  it("normalizes valid history and limits it to the most recent 30 items", () => {
    const history = Array.from({ length: 35 }, (_, index) => ({
      sender: index % 2 === 0 ? "user" : "ai",
      text: ` message ${index} `,
    }));
    const result = validateChatInput("  current question  ", history);

    expect(result?.message).toBe("current question");
    expect(result?.history).toHaveLength(30);
    expect(result?.history[0]?.text).toBe("message 5");
  });

  it("starts Gemini history at a user turn and appends the current message", () => {
    const contents = buildGeminiContents(
      [
        { sender: "ai", text: "greeting" },
        { sender: "user", text: "old question" },
        { sender: "ai", text: "old answer" },
      ],
      "new question",
    );

    expect(contents[0]?.role).toBe("user");
    expect(contents.at(-1)).toEqual({ role: "user", parts: [{ text: "new question" }] });
  });

  it("recognizes configured keys and provides a stable default model", () => {
    expect(isConfiguredApiKey(undefined)).toBe(false);
    expect(isConfiguredApiKey("placeholder-key")).toBe(false);
    expect(isConfiguredApiKey("AIza-valid-looking-key")).toBe(true);
    expect(getGeminiModel("gemini-test-model")).toBe("gemini-test-model");
    expect(getGeminiModel("")).toBe("gemini-2.5-flash");
  });

  it("keeps the offline fallback useful for the main product intents", () => {
    expect(getFallbackResponseText("What package fits my budget?")).toContain("Premium Setup Blueprint");
    expect(getFallbackResponseText("My extruder has a warning")).toContain("Calibration Warning");
  });
});
