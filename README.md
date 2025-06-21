# AI Chat Application

Next.jsとVercel AI SDKを使用して構築された、モダンでレスポンシブなチャットアプリケーションです。

## ✨ 主な機能

- **リアルタイムAIチャット**: AIとシームレスでリアルタイムな会話ができます。
- **ストリーミング応答**: AIの応答はトークンごとにストリーミングされ、よりインタラクティブな体験を提供します。
- **モダンなUI**: Tailwind CSSで構築された、クリーンでレスポンシブなユーザーインターフェース。
- **スケーラブルなアーキテクチャ**: プロジェクトの構造は、[bulletproof-react](https://github.com/alan2207/bulletproof-react)の哲学に触発され、スケーラビリティとメンテナンス性を考慮して設計されています。

## 🛠️ 技術スタック

- **フレームワーク**: [Next.js](https://nextjs.org/)
- **言語**: [TypeScript](https://www.typescriptlang.org/)
- **UI**: [React](https://react.dev/) & [Tailwind CSS](https://tailwindcss.com/)
- **AI連携**: [Vercel AI SDK](https://sdk.vercel.ai/)

## 📂 プロジェクト構造

このプロジェクトは、**bulletproof-react**アーキテクチャに触発された、機能ベースのディレクトリ構造を採用しています。このアプローチは、アプリケーションの成長に合わせてコードベースを整理し、スケーラブルで保守しやすくするのに役立ちます。

特定の機能に関連するすべてのコードは、`src/features/`以下の独自のディレクトリにまとめて配置されます。例えば、チャット機能に関するすべてのコンポーネントとロジックは`src/features/chat/`に存在します。

```
src/
├── app/
│   ├── api/chat/route.ts   # チャット用のAPIエンドポイント
│   └── page.tsx            # メインページのコンポーネント
├── features/
│   └── chat/
│       ├── components/     # チャット機能のReactコンポーネント
│       │   ├── ChatInput.tsx
│       │   ├── ChatList.tsx
│       │   └── ChatMessage.tsx
│       └── index.ts        # チャット機能のエントリーポイント
└── ...
```

また、`tsconfig.json`で設定されたパスエイリアス（`@/*`）を使用して、インポートパスを簡素化し、コードの可読性を向上させています。

## 🚀 はじめに

開発およびテストのために、ローカルマシンでプロジェクトのコピーをセットアップして実行するには、以下の手順に従ってください。

### 前提条件

- Node.js (v18以降)
- npm, yarn, または pnpm

### インストール

1.  **リポジトリをクローンします:**

    ```bash
    git clone https://github.com/your-username/ai-sdk-project.git
    cd ai-sdk-project
    ```

2.  **依存関係をインストールします:**

    ```bash
    pnpm install
    ```

    _このプロジェクトでは `pnpm` の使用を推奨しますが、`npm install` や `yarn` を使用することも可能です。_

3.  **環境変数を設定します:**

    プロジェクトのルートに`.env.local`ファイルを作成し、使用するAIプロバイダーのAPIキーを追加します。例えば、OpenAIを使用する場合：

    ```.env.local
    OPENAI_API_KEY="your_api_key_here"
    ```

    _注意: Vercel AI SDKは様々なモデルをサポートしています。`src/app/api/chat/route.ts`で選択したプロバイダーに対応する正しい環境変数を設定してください。_

4.  **開発サーバーを実行します:**
    ```bash
    pnpm dev
    ```

ブラウザで http://localhost:3000 を開くと、アプリケーションが表示されます。
