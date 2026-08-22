import { describe, expect, it, vi } from "vitest";
import { POST } from "./route";

vi.mock("ai", () => ({
  generateObject: vi.fn(),
}));

vi.mock("@/lib/ai/config", () => ({
  getStudyFlowModel: vi.fn(() => "mock-model"),
}));

describe("POST /api/study-plan", () => {
  it("returns 400 when sourceText is empty or missing", async () => {
    const req = new Request("http://localhost:3000/api/study-plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sourceText: "   " }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);

    const json = await res.json();
    expect(json.error).toBe("Invalid study material provided.");
  });

  it("returns structured study plan when valid sourceText is provided", async () => {
    const { generateObject } = await import("ai");
    const mockStudyPlan = [
      {
        id: "day-1",
        title: "Day 1: Process Scheduling",
        focus: "CPU Scheduling Algorithms",
        tasks: ["Review FCFS and Round Robin", "15 min flashcard drill"],
        duration: "45 minutes",
        priority: "high" as const,
      },
    ];

    vi.mocked(generateObject).mockResolvedValueOnce({
      object: { studyPlan: mockStudyPlan },
    } as never);

    const req = new Request("http://localhost:3000/api/study-plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sourceText: "Operating system processes notes.",
        topics: [{ id: "t1", title: "Process Scheduling" }],
        weakAreas: ["Process Scheduling"],
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.studyPlan).toEqual(mockStudyPlan);
  });

  it("returns 500 when AI generation encounters an error", async () => {
    const { generateObject } = await import("ai");
    vi.mocked(generateObject).mockRejectedValueOnce(
      new Error("API rate limit or connection error")
    );

    const req = new Request("http://localhost:3000/api/study-plan", {
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
      "Unable to generate your study plan right now. Please try again."
    );
  });
});
