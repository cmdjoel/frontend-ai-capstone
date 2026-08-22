import { generateObject } from "ai";
import { z } from "zod";
import { getStudyFlowModel } from "@/lib/ai/config";

const requestSchema = z.object({
  sourceText: z
    .string()
    .trim()
    .min(1, "Study material cannot be empty.")
    .max(100_000, "Study material is too large."),
});

const topicsResponseSchema = z.object({
  topics: z
    .array(
      z.object({
        id: z.string().describe("A unique topic ID, e.g. topic-1"),
        title: z.string().describe("Concise, descriptive topic name"),
        description: z
          .string()
          .describe(
            "A concise 1-2 sentence overview of what this topic covers"
          ),
      })
    )
    .min(1)
    .max(10)
    .describe("List of key study topics extracted from the study material"),
});

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const { sourceText } = requestSchema.parse(body);

    const result = await generateObject({
      model: getStudyFlowModel(),
      schema: topicsResponseSchema,
      prompt: `You are an expert academic tutor analyzing student study material for StudyFlow.

Extract the main core study topics from the material below to organize the student's study pack.

Rules:
- Identify between 3 and 8 distinct, meaningful topics when the material supports it.
- Each topic must have a unique id (e.g. topic-1, topic-2).
- Only include topics directly covered in the provided study material.
- Keep titles concise and descriptive.
- Provide a clear, helpful 1-2 sentence description for each topic explaining what it covers.
- Do not invent concepts not present in the material.

STUDY MATERIAL:
${sourceText}`,
    });

    return Response.json({ topics: result.object.topics });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json(
        { error: "Invalid study material provided." },
        { status: 400 }
      );
    }

    console.error("Study pack generation failed:", error);

    return Response.json(
      {
        error:
          "Unable to generate your study pack right now. Please try again.",
      },
      { status: 500 }
    );
  }
}
