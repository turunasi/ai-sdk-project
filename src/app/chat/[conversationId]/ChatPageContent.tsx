"use client";
import type { Message } from "ai";
import { ChatInput, ChatList } from "@/features/chat";
import { useRouter } from "next/navigation";
import { useChat } from "@ai-sdk/react";

interface ChatPageContentProps {
  conversationId: string;
  initialMessages: Message[];
}

export function ChatPageContent({
  conversationId,
  initialMessages,
}: ChatPageContentProps) {
  const router = useRouter();
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      initialMessages,
      id: conversationId, // useChatに会話IDを渡す
      async onFinish(message) {
        // 非同期操作を現在のレンダリングサイクルから分離するためにPromise.resolve().then()でラップ
        Promise.resolve().then(async () => {
          // onFinishはアシスタントのメッセージがmessages配列に追加された後に呼び出されます。
          const userMessage = input;
          const assistantMessage = message.content; // アシスタントからの最後のメッセージ

          try {
            await fetch("/api/chat/history", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                userMessage,
                assistantMessage,
                conversationId: conversationId,
              }),
            });
            // サイドバーの履歴を更新（最終更新日時が変わるため）
            router.refresh();
          } catch (error) {
            console.error("Failed to save chat history:", error);
          }
        });
      },
    });

  return (
    // This component is now wrapped by MainLayout, so it only needs to render the main chat area.
    <div className="flex flex-1 flex-col">
      {" "}
      {/* Changed from h-screen to flex-1 */}
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
