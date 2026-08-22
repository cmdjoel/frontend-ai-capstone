import { generateText } from "ai";
import { z } from "zod";
import { getStudyFlowModel } from "@/lib/ai/config";

const requestSchema = z.object({
    sourceText: z
        .string()
        .trim()
        .min(1, "Study material cannot be empty.")
        .max(100_000, "Study material is too large."),
});

const topicsSchema = z.array(
    z.object({
        id: z.string(),
        title: z.string(),
        description: z.string(),
    })
);

export async function POST(request: Request) {
    try {
        const body: unknown = await request.json();
        const { sourceText } = requestSchema.parse(body);

        const result = await generateText({
            model: getStudyFlowModel(),
            prompt: `You are analyzing student study material for StudyFlow.

Extract the main study topics from the material below.

Return ONLY valid JSON. Do not use markdown or code fences.

The response must be a JSON array with this exact structure:

[
  {
    "id": "topic-1",
    "title": "Topic name",
    "description": "A concise explanation of what this topic covers."
  }
]

Rules:
- Generate between 3 and 8 topics when the material supports that many.
- Only include topics supported by the provided material.
- Keep titles concise and useful for navigation.
- Make descriptions concise.
- Do not invent information that is not present in the study material.

STUDY MATERIAL:

${sourceText}`,
        });

        let parsedTopics: unknown;

        try {
            parsedTopics = JSON.parse(result.text);
        } catch {
            return Response.json(
                {
                    error:
                        "The AI returned an invalid study pack. Please try generating it again.",
                },
                { status: 502 }
            );
        }

        const topics = topicsSchema.parse(parsedTopics);

        return Response.json({ topics });
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