import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { StudyWorkflowProgress } from "./StudyWorkflowProgress";

let mockPathname = "/upload";

vi.mock("next/navigation", () => ({
  usePathname: () => mockPathname,
}));

vi.mock("@/context/StudySessionContext", () => ({
  useStudySession: vi.fn(() => ({
    session: {
      id: "session-1",
      documentName: "Biology 101",
      documentType: "text",
      sourceText: "Sample biology notes.",
      createdAt: "2026-08-24T00:00:00.000Z",
      topics: [{ id: "t1", title: "Cells" }],
      summary: "Sample summary",
      flashcards: [{ id: "f1", front: "Q", back: "A" }],
      quiz: [{ id: "q1", question: "Q?", options: ["A", "B", "C", "D"], correctAnswer: 0 }],
      quizAnswers: [{ questionId: "q1", selectedAnswer: 0, isCorrect: true }],
      weakAreas: ["Genetics"],
      studyPlan: [{ id: "d1", title: "Day 1", focus: "Cells", tasks: ["Review"], duration: "1h", priority: "high" }],
    },
    isHydrated: true,
  })),
}));

describe("StudyWorkflowProgress", () => {
  it("renders all 6 workflow steps when on a workflow route", () => {
    mockPathname = "/upload";
    render(<StudyWorkflowProgress />);

    expect(screen.getByText("Upload")).toBeDefined();
    expect(screen.getByText("Study Pack")).toBeDefined();
    expect(screen.getByText("Learn")).toBeDefined();
    expect(screen.getByText("Practice")).toBeDefined();
    expect(screen.getByText("Review")).toBeDefined();
    expect(screen.getByText("Plan")).toBeDefined();
  });

  it("marks 'Study Pack' active when on /summary", () => {
    mockPathname = "/summary";
    render(<StudyWorkflowProgress />);

    const activeLink = screen.getByRole("link", { name: /Study Pack/i });
    expect(activeLink.getAttribute("aria-current")).toBe("step");
  });

  it("marks 'Learn' active when on /chat", () => {
    mockPathname = "/chat";
    render(<StudyWorkflowProgress />);

    const activeLink = screen.getByRole("link", { name: /Learn/i });
    expect(activeLink.getAttribute("aria-current")).toBe("step");
  });

  it("marks 'Practice' active when on /quiz/results", () => {
    mockPathname = "/quiz/results";
    render(<StudyWorkflowProgress />);

    const activeLink = screen.getByRole("link", { name: /Practice/i });
    expect(activeLink.getAttribute("aria-current")).toBe("step");
  });

  it("returns null when on non-workflow routes like / or /settings", () => {
    mockPathname = "/settings";
    const { container } = render(<StudyWorkflowProgress />);
    expect(container.firstChild).toBeNull();
  });
});
