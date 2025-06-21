"use client";

import { useChat } from "@ai-sdk/react";
import { ChatList, ChatInput } from "../features/chat";
import { Sidebar } from "@/components/Sidebar"; // 汎用Sidebarをインポート
import { UserSidebarContent } from "../features/auth/components/UserSidebarContent";

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat();
  return (
    <div className="flex h-screen bg-white dark:bg-zinc-950">
      <Sidebar>
        {" "}
        {/* 汎用Sidebarコンポーネントを使用 */}
        <UserSidebarContent /> {/* 認証用のコンテンツを子要素として渡す */}
      </Sidebar>
      <main className="flex flex-1 flex-col">
        <header className="border-b border-zinc-200 p-4 dark:border-zinc-800">
          <h1 className="text-center text-xl font-bold text-zinc-900 dark:text-zinc-100">
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
      </main>
    </div>
  );
}
