import { describe, expect, it, vi } from "vitest";
import { POST } from "./route";

vi.mock("ai", () => ({
  generateObject: vi.fn(),
}));

vi.mock("@/lib/ai/config", () => ({
  getStudyFlowModel: vi.fn(() => "mock-model"),
}));

describe("POST /api/quiz", () => {
  it("returns 400 when sourceText is empty or missing", async () => {
    const req = new Request("http://localhost:3000/api/quiz", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sourceText: "   " }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);

    const json = await res.json();
    expect(json.error).toBe("Invalid study material provided.");
  });

  it("returns structured quiz questions when valid sourceText is provided", async () => {
    const { generateObject } = await import("ai");
    const mockQuiz = [
      {
        id: "q-1",
        question: "Which CPU scheduling algorithm is non-preemptive by default?",
        options: ["Round Robin", "First-Come, First-Served", "Shortest Remaining Time First", "Priority Preemptive"],
        correctAnswer: 1,
        topicId: "t1",
      },
    ];

    vi.mocked(generateObject).mockResolvedValueOnce({
      object: { quiz: mockQuiz },
    } as never);

    const req = new Request("http://localhost:3000/api/quiz", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sourceText: "CPU scheduling lecture notes.",
        topics: [{ id: "t1", title: "CPU Scheduling" }],
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.quiz).toEqual(mockQuiz);
  });

  it("returns 500 when AI generation encounters an error", async () => {
    const { generateObject } = await import("ai");
    vi.mocked(generateObject).mockRejectedValueOnce(
      new Error("API rate limit error")
    );

    const req = new Request("http://localhost:3000/api/quiz", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sourceText: "Valid lecture notes.",
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(500);

    const json = await res.json();
    expect(json.error).toBe(
      "Unable to generate your quiz right now. Please try again."
    );
  });
});
