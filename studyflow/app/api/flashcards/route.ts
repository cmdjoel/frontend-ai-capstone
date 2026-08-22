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
    .optional(),
});

const flashcardsResponseSchema = z.object({
  flashcards: z
    .array(
      z.object({
        id: z
          .string()
          .describe("Unique identifier for the flashcard, e.g. card-1"),
        question: z
          .string()
          .describe("A clear, targeted question designed for active recall"),
        answer: z
          .string()
          .describe(
            "A concise, complete answer explaining the term or concept"
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
    .max(20)
    .describe("List of high-quality study flashcards"),
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
                `- ID: "${t.id}" | Title: "${t.title}"${
                  t.description ? ` | Description: "${t.description}"` : ""
                }`
            )
            .join("\n")}`
        : "";

    const prompt = `You are an expert academic tutor creating active recall flashcards for StudyFlow.
Generate between 8 and 15 high-quality, high-yield study flashcards from the provided study material.

Rules:
- Focus on critical academic concepts, definitions, mechanisms, principles, and distinctions.
- Questions must be direct, specific, and prompt genuine recall (avoid vague or yes/no questions).
- Answers must be concise, accurate, and educational (1-3 sentences).
- Each flashcard must have a unique id (e.g. "card-1", "card-2").
- If topics are provided below, tag each card with the relevant topic ID using the 'topicId' field where appropriate.${topicsContext}
- Ground all questions and answers strictly in the provided study material.

STUDY MATERIAL:
${sourceText}`;

    const result = await generateObject({
      model: getStudyFlowModel(),
      schema: flashcardsResponseSchema,
      prompt,
    });

    return Response.json({ flashcards: result.object.flashcards });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json(
        { error: "Invalid study material provided." },
        { status: 400 }
      );
    }

    console.error("Flashcards generation failed:", error);

    return Response.json(
      {
        error:
          "Unable to generate your flashcards right now. Please try again.",
      },
      { status: 500 }
    );
  }
}
