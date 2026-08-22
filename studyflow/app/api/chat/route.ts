import { streamText, convertToModelMessages } from "ai";
import { getStudyFlowModel, STUDYFLOW_SYSTEM_PROMPT } from "@/lib/ai/config";

export interface StudyChatContext {
  documentName?: string;
  documentType?: "text" | "pdf";
  sourceText?: string;
  topics?: Array<{ id: string; title: string; description?: string }>;
  summary?: string;
  weakAreas?: string[];
  quizPerformance?: {
    totalQuestions: number;
    correctCount: number;
    incorrectCount: number;
    percentage: number;
  };
  studyPlan?: Array<{
    title: string;
    focus: string;
    duration: string;
    priority: string;
  }>;
}

export function buildSystemPrompt(studyContext?: StudyChatContext | null): string {
  if (!studyContext || !studyContext.documentName) {
    return STUDYFLOW_SYSTEM_PROMPT;
  }

  const sections: string[] = [
    STUDYFLOW_SYSTEM_PROMPT,
    "\n--- ACTIVE STUDENT STUDY SESSION CONTEXT ---",
  ];

  sections.push(`Study Material / Document: "${studyContext.documentName}"`);

  if (studyContext.topics && studyContext.topics.length > 0) {
    sections.push(
      `Core Topics Identified:\n${studyContext.topics
        .map(
          (t, i) =>
            `${i + 1}. **${t.title}**${t.description ? `: ${t.description}` : ""}`
        )
        .join("\n")}`
    );
  }

  if (studyContext.summary) {
    sections.push(`Study Summary:\n${studyContext.summary}`);
  }

  if (studyContext.quizPerformance) {
    const qp = studyContext.quizPerformance;
    sections.push(
      `Quiz Performance: ${qp.correctCount}/${qp.totalQuestions} correct (${qp.percentage}% score, ${qp.incorrectCount} missed).`
    );
  }

  if (studyContext.weakAreas && studyContext.weakAreas.length > 0) {
    sections.push(
      `Identified Weak Areas (Needs extra attention & practice):\n${studyContext.weakAreas
        .map((w) => `- ${w}`)
        .join("\n")}`
    );
  }

  if (studyContext.studyPlan && studyContext.studyPlan.length > 0) {
    sections.push(
      `Personalized Study Plan Milestones:\n${studyContext.studyPlan
        .map(
          (p) =>
            `- ${p.title} [Priority: ${p.priority}, Duration: ${p.duration}] | Focus: ${p.focus}`
        )
        .join("\n")}`
    );
  }

  if (studyContext.sourceText) {
    // Safe truncation to avoid excessive tokens
    const truncatedSource = studyContext.sourceText.slice(0, 30_000);
    sections.push(`Raw Study Material Notes (Excerpt):\n${truncatedSource}`);
  }

  sections.push(
    `TUTOR DIRECTIVES:`,
    `- Tutor the student specifically on their study session material above.`,
    `- Ground explanations in their notes, topics, and summary whenever relevant.`,
    `- If the student asks for practice, revision, or explanation of difficulties, prioritize their weak areas (${
      studyContext.weakAreas?.join(", ") || "none specified"
    }).`,
    `- Use interactive questions and active recall prompts to verify their understanding.`,
    `- If asked about their performance or study schedule, reference their quiz results and study plan directly.`,
    `- If the user asks general academic questions outside the notes, answer helpfully while maintaining your role as an academic tutor.`
  );

  return sections.join("\n\n");
}

export async function POST(req: Request) {
  try {
    const body: unknown = await req.json();

    if (!body || typeof body !== "object") {
      return Response.json(
        { error: "Invalid request body." },
        { status: 400 }
      );
    }

    const { messages, studyContext } = body as {
      messages?: unknown;
      studyContext?: StudyChatContext;
    };

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return Response.json(
        { error: "Invalid request: messages array is required." },
        { status: 400 }
      );
    }

    const modelMessages = await convertToModelMessages(messages);
    const systemPrompt = buildSystemPrompt(studyContext);

    const result = streamText({
      model: getStudyFlowModel(),
      system: systemPrompt,
      messages: modelMessages,
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Chat API error:", error);
    return Response.json(
      { error: "Unable to process chat request. Please try again." },
      { status: 500 }
    );
  }
}
