import { describe, expect, it, vi } from "vitest";
import { POST } from "./route";

vi.mock("ai", () => ({
  generateObject: vi.fn(),
}));

vi.mock("@/lib/ai/config", () => ({
  getStudyFlowModel: vi.fn(() => "mock-model"),
}));

describe("POST /api/study-pack", () => {
  it("returns 400 when sourceText is empty or missing", async () => {
    const req = new Request("http://localhost:3000/api/study-pack", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sourceText: "   " }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);

    const json = await res.json();
    expect(json.error).toBe("Invalid study material provided.");
  });

  it("returns structured topics when valid sourceText is provided", async () => {
    const { generateObject } = await import("ai");
    const mockTopics = [
      {
        id: "topic-1",
        title: "Process Scheduling",
        description: "Covers CPU scheduling algorithms and preemption.",
      },
      {
        id: "topic-2",
        title: "Memory Management",
        description: "Covers virtual memory, paging, and segmentation.",
      },
    ];

    vi.mocked(generateObject).mockResolvedValueOnce({
      object: { topics: mockTopics },
    } as never);

    const req = new Request("http://localhost:3000/api/study-pack", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sourceText: "Operating systems notes on processes and memory management.",
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.topics).toEqual(mockTopics);
  });

  it("returns 500 when AI generation encounters an error", async () => {
    const { generateObject } = await import("ai");
    vi.mocked(generateObject).mockRejectedValueOnce(
      new Error("API rate limit or connection failure")
    );

    const req = new Request("http://localhost:3000/api/study-pack", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sourceText: "Valid notes content.",
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(500);

    const json = await res.json();
    expect(json.error).toBe(
      "Unable to generate your study pack right now. Please try again."
    );
  });
});
