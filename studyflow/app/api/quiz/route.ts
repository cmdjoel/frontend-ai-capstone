import { generateObject } from "ai";
import { z } from "zod";
import { getStudyFlowModel } from "@/lib/ai/config";

const requestSchema = z.object({
  sourceText: z
    .string()
    .trim()
    .min(1, "Study material cannot be empty.")
    .max(100_000, "Study material is too large."),
  topics: z
    .array(
      z.object({
        id: z.string(),
        title: z.string(),
        description: z.string().optional(),
      })
    )
    .nullish(),
});

const quizResponseSchema = z.object({
  quiz: z
    .array(
      z.object({
        id: z
          .string()
          .describe("Unique identifier for the question, e.g. q-1"),
        question: z
          .string()
          .describe("Clear, challenging multiple choice question text"),
        options: z
          .array(z.string())
          .length(4)
          .describe("Exactly 4 plausible options for the question"),
        correctAnswer: z
          .number()
          .int()
          .min(0)
          .max(3)
          .describe(
            "The 0-based index (0, 1, 2, or 3) of the correct option in options array"
          ),
        topicId: z
          .string()
          .optional()
          .describe(
            "The matching topic ID from the provided topics if applicable"
          ),
      })
    )
    .min(1)
    .max(15)
    .describe("List of 5 to 10 multiple-choice quiz questions"),
});

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const { sourceText, topics } = requestSchema.parse(body);

    const topicsContext =
      topics && topics.length > 0
        ? `\n\nCORE TOPICS IDENTIFIED IN STUDY PACK:\n${topics
          .map(
            (t) =>
              `- ID: "${t.id}" | Title: "${t.title}"${t.description ? ` | Description: "${t.description}"` : ""
              }`
          )
          .join("\n")}`
        : "";

    const prompt = `You are an expert academic evaluator designing a practice assessment quiz for StudyFlow.
Generate between 5 and 10 high-quality, conceptual multiple-choice questions from the provided study material.

Rules:
- Questions must assess comprehension, active recall, mechanisms, and application of knowledge.
- Avoid superficial or trivial copy-paste questions.
- Each question must have EXACTLY 4 plausible answer options.
- 'correctAnswer' must be the exact 0-based integer index (0, 1, 2, or 3) of the correct answer choice.
- Each question must have a unique id (e.g. "q-1", "q-2").
- If topics are provided below, assign the matching topic ID in the 'topicId' field for each question.${topicsContext}
- Ground all questions strictly in the provided study material.

STUDY MATERIAL:
${sourceText}`;

    const result = await generateObject({
      model: getStudyFlowModel(),
      schema: quizResponseSchema,
      prompt,
    });

    return Response.json({ quiz: result.object.quiz });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json(
        { error: "Invalid study material provided." },
        { status: 400 }
      );
    }

    console.error("Quiz generation failed:", error);

    return Response.json(
      {
        error:
          "Unable to generate your quiz right now. Please try again.",
      },
      { status: 500 }
    );
  }
}
