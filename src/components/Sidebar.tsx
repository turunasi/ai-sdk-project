import React from "react";

interface SidebarProps {
  children: React.ReactNode;
}

/**
 * アプリケーションの汎用サイドバーコンポーネント。
 * 子要素としてコンテンツを受け取り、サイドバーの基本的なレイアウトとスタイルを提供します。
 */
export function Sidebar({ children }: SidebarProps) {
  return (
    <aside className="flex w-64 flex-col border-r border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
      {children}
    </aside>
  );
}
