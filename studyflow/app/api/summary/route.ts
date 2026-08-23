import { generateText } from "ai";
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
  explanationDetail: z.enum(["Brief", "Standard", "Detailed"]).optional(),
});

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const { sourceText, topics, explanationDetail = "Standard" } =
      requestSchema.parse(body);

    const topicsContext =
      topics && topics.length > 0
        ? `\n\nCORE TOPICS IDENTIFIED IN STUDY PACK:\n${topics
            .map((t, i) => `${i + 1}. **${t.title}**${t.description ? `: ${t.description}` : ""}`)
            .join("\n")}`
        : "";

    const detailInstruction =
      explanationDetail === "Brief"
        ? "- Detail Level: BRIEF. Keep the summary concise, highly condensed, and focused strictly on the core takeaways without unnecessary elaboration."
        : explanationDetail === "Detailed"
        ? "- Detail Level: DETAILED. Provide an in-depth, comprehensive breakdown with thorough conceptual context, step-by-step mechanisms, and illustrative examples."
        : "- Detail Level: STANDARD. Provide a clear, balanced overview with concise illustrative examples where appropriate.";

    const prompt = `You are an expert academic tutor for StudyFlow.
Generate a comprehensive, well-structured, and clear study summary based on the provided student study material.

Guidelines:
${detailInstruction}
- Focus on the most important academic concepts, principles, and key takeaways.
- Use clear markdown structure with headings (## and ###), bullet points, bold key terms, and numbered steps where appropriate.
- Include concise, essential definitions for critical terms.
- Highlight relationships, distinctions, and comparisons between key concepts.
- Avoid unnecessary filler, conversational preamble, or meta-commentary (do not start with "Here is a summary:").
- Ground all facts strictly in the provided study material.${topicsContext}

STUDY MATERIAL:
${sourceText}`;

    const result = await generateText({
      model: getStudyFlowModel(),
      prompt,
    });

    return Response.json({ summary: result.text });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json(
        { error: "Invalid study material provided." },
        { status: 400 }
      );
    }

    console.error("Summary generation failed:", error);

    return Response.json(
      {
        error:
          "Unable to generate your study summary right now. Please try again.",
      },
      { status: 500 }
    );
  }
}
