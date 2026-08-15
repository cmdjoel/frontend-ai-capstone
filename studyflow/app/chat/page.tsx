import { Chat } from "@/components/chat/Chat";

export const metadata = {
  title: "AI Chat | StudyFlow",
  description: "Interactive AI study assistant with real-time streaming responses",
};

export default function ChatPage() {
  return (
    <div className="h-[100dvh] max-h-[100dvh] flex flex-col bg-zinc-50 dark:bg-black overflow-hidden">
      <Chat />
    </div>
  );
}
