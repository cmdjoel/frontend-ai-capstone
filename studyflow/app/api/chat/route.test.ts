import { describe, expect, it, vi } from "vitest";
import { buildSystemPrompt, POST } from "./route";

vi.mock("ai", () => ({
  streamText: vi.fn(() => ({
    toUIMessageStreamResponse: vi.fn(
      () => new Response("streaming-response", { status: 200 })
    ),
  })),
  convertToModelMessages: vi.fn(async (msgs) => msgs),
}));

vi.mock("@/lib/ai/config", () => ({
  getStudyFlowModel: vi.fn(() => "mock-model"),
  STUDYFLOW_SYSTEM_PROMPT: "Base StudyFlow System Prompt",
}));

describe("POST /api/chat", () => {
  it("returns 400 when messages array is missing or empty", async () => {
    const req = new Request("http://localhost:3000/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: [] }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);

    const json = await res.json();
    expect(json.error).toBe("Invalid request: messages array is required.");
  });

  it("handles chat request without study context successfully", async () => {
    const req = new Request("http://localhost:3000/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [{ role: "user", parts: [{ type: "text", text: "Hello AI" }] }],
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
  });

  it("incorporates study session context into prompt correctly", () => {
    const prompt = buildSystemPrompt({
      documentName: "Operating Systems Lecture 1",
      topics: [{ id: "t1", title: "Processes" }],
      weakAreas: ["Deadlocks"],
      quizPerformance: {
        totalQuestions: 5,
        correctCount: 3,
        incorrectCount: 2,
        percentage: 60,
      },
    });

    expect(prompt).toContain("Operating Systems Lecture 1");
    expect(prompt).toContain("Processes");
    expect(prompt).toContain("Deadlocks");
    expect(prompt).toContain("60%");
  });

  it("incorporates explanationDetail preference into system prompt correctly", () => {
    const briefPrompt = buildSystemPrompt({
      documentName: "Biology 101",
      explanationDetail: "Brief",
    });
    expect(briefPrompt).toContain("Detail Level: BRIEF");

    const detailedPrompt = buildSystemPrompt({
      documentName: "Biology 101",
      explanationDetail: "Detailed",
    });
    expect(detailedPrompt).toContain("Detail Level: DETAILED");

    const noSessionBriefPrompt = buildSystemPrompt({
      explanationDetail: "Brief",
    });
    expect(noSessionBriefPrompt).toContain("Detail Level: BRIEF");
  });

  it("returns 500 when streaming encounters an unexpected error", async () => {
    const { streamText } = await import("ai");
    vi.mocked(streamText).mockImplementationOnce(() => {
      throw new Error("Stream failure");
    });

    const req = new Request("http://localhost:3000/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [{ role: "user", parts: [{ type: "text", text: "Test message" }] }],
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(500);

    const json = await res.json();
    expect(json.error).toBe("Unable to process chat request. Please try again.");
  });
});
