"use client";

interface ChatInputProps {
  input: string;
  handleInputChange: (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>,
  ) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
}

export function ChatInput({
  input,
  handleInputChange,
  handleSubmit,
  isLoading,
}: ChatInputProps) {
  return (
    <div className="border-t border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <input
          className="flex-1 rounded-lg border border-zinc-300 bg-transparent p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-zinc-700"
          value={input}
          onChange={handleInputChange}
          placeholder="AIにメッセージを送信..."
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="rounded-lg bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-zinc-400"
        >
          送信
        </button>
      </form>
    </div>
  );
}
