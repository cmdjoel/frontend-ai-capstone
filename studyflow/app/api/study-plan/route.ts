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
  weakAreas: z.array(z.string()).nullish(),
});

const studyPlanResponseSchema = z.object({
  studyPlan: z
    .array(
      z.object({
        id: z
          .string()
          .describe("Unique identifier, e.g. day-1, day-2"),
        title: z
          .string()
          .describe(
            "Session title, e.g. 'Day 1: Virtual Memory & Page Replacement'"
          ),
        focus: z
          .string()
          .describe("Main conceptual focus for this study milestone"),
        tasks: z
          .array(z.string())
          .min(1)
          .describe(
            "Actionable active recall tasks (e.g. Flashcard drills, Concept mapping, Practice problems)"
          ),
        duration: z
          .string()
          .describe("Estimated study duration, e.g. '45 minutes' or '1.5 hours'"),
        priority: z
          .enum(["high", "medium", "low"])
          .describe(
            "Priority level: 'high' for weak areas, 'medium' or 'low' for general review"
          ),
      })
    )
    .min(1)
    .max(10)
    .describe("List of 3 to 7 personalized daily study milestones"),
});

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const { sourceText, topics, weakAreas } = requestSchema.parse(body);

    const weakAreasContext =
      weakAreas && weakAreas.length > 0
        ? `\n\nIDENTIFIED STUDENT WEAK AREAS (MUST BE PRIORITIZED HIGH IN EARLY DAYS):\n${weakAreas
          .map((w, i) => `${i + 1}. ${w}`)
          .join("\n")}`
        : "";

    const topicsContext =
      topics && topics.length > 0
        ? `\n\nCORE TOPICS IN STUDY PACK:\n${topics
          .map((t) => `- ${t.title}${t.description ? `: ${t.description}` : ""}`)
          .join("\n")}`
        : "";

    const prompt = `You are an expert academic study strategist for StudyFlow.
Generate a structured, personalized 3-to-7 day study plan tailored to the student's material and quiz weaknesses.

Rules:
- Give highest priority ("high") and earliest schedule slots (Day 1, Day 2) to the student's identified weak areas.
- For each study milestone, provide concrete, actionable study tasks (such as active recall drills, reviewing difficult quiz questions, practicing flashcards, and summary reading).
- Give realistic study durations (e.g. "45 minutes", "1 hour", "1.5 hours").
- Each session must have a unique id (e.g. "day-1", "day-2").
- Do not use vague motivational filler.${weakAreasContext}${topicsContext}

STUDY MATERIAL:
${sourceText}`;

    const result = await generateObject({
      model: getStudyFlowModel(),
      schema: studyPlanResponseSchema,
      prompt,
    });

    return Response.json({ studyPlan: result.object.studyPlan });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json(
        { error: "Invalid study material provided." },
        { status: 400 }
      );
    }

    console.error("Study plan generation failed:", error);

    return Response.json(
      {
        error:
          "Unable to generate your study plan right now. Please try again.",
      },
      { status: 500 }
    );
  }
}
