import { streamText, convertToModelMessages } from "ai";
import { getStudyFlowModel, STUDYFLOW_SYSTEM_PROMPT } from "@/lib/ai/config";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const modelMessages = await convertToModelMessages(messages);

  const result = streamText({
    model: getStudyFlowModel(),
    system: STUDYFLOW_SYSTEM_PROMPT,
    messages: modelMessages,
  });

  return result.toUIMessageStreamResponse();
}
