"use client";

import { useRouter } from "next/navigation";
import { PlusCircle } from "lucide-react";

export function NewChatButton() {
  const router = useRouter();

  const handleNewChat = () => {
    router.push("/chat");
  };

  return (
    <button
      onClick={handleNewChat}
      className="flex w-full items-center justify-center gap-2 rounded-lg border border-zinc-300 p-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
    >
      <PlusCircle size={16} />
      New Chat
    </button>
  );
}
