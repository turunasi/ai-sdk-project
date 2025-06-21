"use client";

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
    <div className="flex h-full flex-col">
      {" "}
      {/* サイドバー内のコンテンツを縦方向に配置 */}
      <div className="flex-1">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          ユーザー情報
        </h2>
        <div className="mt-4 space-y-4">
          <div>
            <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              名前
            </span>
            <p className="truncate text-zinc-900 dark:text-zinc-100">
              {user.name}
            </p>
          </div>
          <div>
            <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              メールアドレス
            </span>
            <p className="truncate text-zinc-900 dark:text-zinc-100">
              {user.email}
            </p>
          </div>
        </div>
      </div>
      <button
        onClick={handleSignOut}
        className="mt-4 w-full rounded-lg bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none"
      >
        ログアウト
      </button>
    </div>
  );
}
