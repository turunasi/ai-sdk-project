import { type Message } from "ai/react";

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";
  return (
    <div className={`flex items-start gap-4 ${isUser ? "justify-end" : ""}`}>
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center font-bold text-zinc-600 dark:text-zinc-300">
          AI
        </div>
      )}
      <div
        className={`p-3 rounded-lg max-w-sm md:max-w-md lg:max-w-lg ${
          isUser ? "bg-blue-500 text-white" : "bg-zinc-100 dark:bg-zinc-800"
        }`}
      >
        <div className="whitespace-pre-wrap">{message.content}</div>
      </div>
      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center font-bold text-zinc-600 dark:text-zinc-300">
          U
        </div>
      )}
    </div>
  );
}
