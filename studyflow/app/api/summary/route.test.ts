import { describe, expect, it, vi } from "vitest";
import { POST } from "./route";

vi.mock("ai", () => ({
  generateText: vi.fn(),
}));

vi.mock("@/lib/ai/config", () => ({
  getStudyFlowModel: vi.fn(() => "mock-model"),
}));

describe("POST /api/summary", () => {
  it("returns 400 when sourceText is empty or missing", async () => {
    const req = new Request("http://localhost:3000/api/summary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sourceText: "   " }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);

    const json = await res.json();
    expect(json.error).toBe("Invalid study material provided.");
  });

  it("returns summary when valid sourceText is provided", async () => {
    const { generateText } = await import("ai");
    const mockSummary = "## Key Concepts\n- Concept A: explanation\n- Concept B: explanation";

    vi.mocked(generateText).mockResolvedValueOnce({
      text: mockSummary,
    } as never);

    const req = new Request("http://localhost:3000/api/summary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sourceText: "Detailed study notes on operating system architectures.",
        topics: [
          { id: "t1", title: "Architecture", description: "Kernel structures" },
        ],
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.summary).toBe(mockSummary);
  });

  it("returns 500 when AI generation encounters an error", async () => {
    const { generateText } = await import("ai");
    vi.mocked(generateText).mockRejectedValueOnce(
      new Error("API connection error")
    );

    const req = new Request("http://localhost:3000/api/summary", {
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
      "Unable to generate your study summary right now. Please try again."
    );
  });
});
