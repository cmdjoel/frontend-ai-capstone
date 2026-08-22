import { describe, expect, it, vi } from "vitest";
import { POST } from "./route";

vi.mock("ai", () => ({
  generateObject: vi.fn(),
}));

vi.mock("@/lib/ai/config", () => ({
  getStudyFlowModel: vi.fn(() => "mock-model"),
}));

describe("POST /api/flashcards", () => {
  it("returns 400 when sourceText is empty or missing", async () => {
    const req = new Request("http://localhost:3000/api/flashcards", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sourceText: "   " }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);

    const json = await res.json();
    expect(json.error).toBe("Invalid study material provided.");
  });

  it("returns structured flashcards when valid sourceText is provided", async () => {
    const { generateObject } = await import("ai");
    const mockFlashcards = [
      {
        id: "card-1",
        question: "What is the purpose of virtual memory?",
        answer:
          "Virtual memory provides an illusion of a large contiguous address space and enables paging to disk.",
        topicId: "t1",
      },
      {
        id: "card-2",
        question: "What is thrashing?",
        answer:
          "A state where the CPU spends more time swapping pages in and out than executing processes.",
        topicId: "t1",
      },
    ];

    vi.mocked(generateObject).mockResolvedValueOnce({
      object: { flashcards: mockFlashcards },
    } as never);

    const req = new Request("http://localhost:3000/api/flashcards", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sourceText: "Operating system memory notes.",
        topics: [{ id: "t1", title: "Memory Management" }],
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.flashcards).toEqual(mockFlashcards);
  });

  it("returns 500 when AI generation encounters an error", async () => {
    const { generateObject } = await import("ai");
    vi.mocked(generateObject).mockRejectedValueOnce(
      new Error("API rate limit error")
    );

    const req = new Request("http://localhost:3000/api/flashcards", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sourceText: "Valid lecture content.",
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(500);

    const json = await res.json();
    expect(json.error).toBe(
      "Unable to generate your flashcards right now. Please try again."
    );
  });
});
