"use client";

import { useChat } from "@ai-sdk/react";
import { ChatList, ChatInput } from "../features/chat";

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat();
  return (
    <div className="flex flex-col h-screen bg-white dark:bg-zinc-950">
      <header className="p-4 border-b border-zinc-200 dark:border-zinc-800">
        <h1 className="text-xl font-bold text-center text-zinc-900 dark:text-zinc-100">
          AI Chat
        </h1>
      </header>
      <ChatList messages={messages} />
      <ChatInput
        input={input}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  );
}
