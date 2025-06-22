"use client";

import { LogOut } from "lucide-react";
import { signOut, useSession } from "next-auth/react";

/**
 * ログインユーザーの情報とログアウトボタンを表示するサイドバーコンテンツコンポーネント。
 * 汎用Sidebarコンポーネントの子要素として使用されます。
 */
export function UserSidebarContent() {
  const { data: session } = useSession();

  if (!session || !session.user) {
    // セッション情報が読み込まれるまでは何も表示しないか、ローディングコンポーネントを表示します。
    return null;
  }

  const { user } = session;

  const handleSignOut = () => {
    signOut({ callbackUrl: "/login" });
  };

  return (
    // mt-autoでコンテナの下部に配置し、境界線を追加
    <div className="mt-auto border-t border-zinc-200 p-4 dark:border-zinc-800">
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <p className="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            {user.name}
          </p>
          <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
            {user.email}
          </p>
        </div>
        <button
          onClick={handleSignOut}
          className="rounded-md p-2 text-zinc-500 hover:bg-zinc-200 hover:text-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
        >
          <LogOut size={18} />
          <span className="sr-only">ログアウト</span>
        </button>
      </div>
    </div>
  );
}
