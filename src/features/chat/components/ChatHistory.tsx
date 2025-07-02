"use client"; // Make it a Client Component
import Link from "next/link";
import { useParams } from "next/navigation";
import { NewChatButton } from "./NewChatButton";

interface ChatHistoryProps {
  history: { id: string; title: string }[];
}

export function ChatHistory({ history }: ChatHistoryProps) {
  const params = useParams();
  const currentConversationId = params.conversationId as string;

  return (
    <div className="min-h-0 flex-1 overflow-y-auto p-4">
      <NewChatButton />
      <nav className="mt-4 grid gap-1">
        {history.map((chat) => {
          const isActive = chat.id === currentConversationId;
          return (
            <Link
              key={chat.id}
              href={`/chat/${chat.id}`}
              className={`group flex items-center rounded-md px-3 py-2 text-sm font-medium ${
                isActive
                  ? "bg-zinc-200 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100"
                  : "text-zinc-700 hover:bg-zinc-200 dark:text-zinc-300 dark:hover:bg-zinc-800"
              }`}
            >
              <span className="truncate">{chat.title}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
