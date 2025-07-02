"use client";

import { type Message } from "ai/react";
import {
  Bot,
  Check,
  ChevronDown,
  ChevronUp,
  Copy,
  Paperclip,
  User,
} from "lucide-react";
import { RefContentType } from "../types";
import { useState } from "react";

interface ChatMessageProps {
  message: Message;
}

function RefContentDisplay({ refContents }: { refContents: RefContentType[] }) {
  const [isOpen, setIsOpen] = useState(true); // デフォルトで開いた状態

  // refContentsが空または存在しない場合は何も表示しない
  if (!refContents || refContents.length === 0) {
    return null;
  }

  return (
    <div className="mt-2 rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-700 dark:bg-zinc-800">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between text-left text-sm font-semibold text-zinc-600 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
      >
        <div className="flex items-center gap-2">
          <Paperclip size={16} />
          <span>参照情報</span>
        </div>
        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      {isOpen && (
        <div className="mt-3 grid gap-2">
          {refContents.map((ref, index) => (
            <div
              key={ref.id || index} // idがあればidを、なければindexをkeyに使用
              className="rounded-md border border-zinc-200 bg-white p-3 shadow-sm dark:border-zinc-600 dark:bg-zinc-700"
            >
              <h4 className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                {ref.title || "タイトルなし"}
              </h4>
              <p className="mt-1 line-clamp-2 text-xs text-zinc-600 dark:text-zinc-400">
                {ref.description || ref.content || "説明がありません。"}
              </p>
              {/* 必要であれば、詳細表示へのリンクやモーダルなどを追加 */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    if (!message.content) return;
    try {
      await navigator.clipboard.writeText(message.content);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); // 2秒後にアイコンを元に戻す
    } catch (err) {
      console.error("Failed to copy message:", err);
    }
  };

  let refContents: RefContentType[] = [];
  try {
    if (message.annotations?.[0]?.data) {
      const parsedData = JSON.parse(message.annotations[0].data);
      if (Array.isArray(parsedData)) {
        refContents = parsedData;
      }
    }
  } catch (error) {
    console.error("Failed to parse refContents:", error);
  }

  return (
    <div
      className={`group flex items-start gap-4 ${isUser ? "justify-end" : ""}`}
    >
      {!isUser && (
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-zinc-200 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300">
          <Bot size={20} />
        </div>
      )}
      <div className="max-w-sm md:max-w-md lg:max-w-lg">
        <div
          className={`rounded-xl p-3 shadow-md ${
            isUser ? "bg-blue-500 text-white" : "bg-zinc-100 dark:bg-zinc-800"
          }`}
        >
          <div className="whitespace-pre-wrap">{message.content}</div>
          {!isUser && message.content && (
            <div className="mt-2 flex justify-start">
              <button
                onClick={handleCopy}
                className="rounded-md p-2 text-zinc-500 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-zinc-200 dark:text-zinc-400 dark:hover:bg-zinc-700"
                aria-label={isCopied ? "Copied" : "Copy message"}
              >
                {isCopied ? (
                  <Check size={12} className="text-green-500" />
                ) : (
                  <Copy size={12} />
                )}
              </button>
            </div>
          )}
        </div>
        {!isUser && refContents.length > 0 && (
          <RefContentDisplay refContents={refContents} />
        )}
      </div>
      {isUser && (
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-zinc-200 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300">
          <User size={20} />
        </div>
      )}
    </div>
  );
}
