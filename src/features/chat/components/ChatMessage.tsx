import { type Message } from "ai/react";

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";
  return (
    <div className={`flex items-start gap-4 ${isUser ? "justify-end" : ""}`}>
      {!isUser && (
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-zinc-200 font-bold text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300">
          AI
        </div>
      )}
      <div
        className={`max-w-sm rounded-lg p-3 md:max-w-md lg:max-w-lg ${
          isUser ? "bg-blue-500 text-white" : "bg-zinc-100 dark:bg-zinc-800"
        }`}
      >
        <div className="whitespace-pre-wrap">{message.content}</div>
      </div>
      {isUser && (
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-zinc-200 font-bold text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300">
          U
        </div>
      )}
    </div>
  );
}
