# AIチャットアプリケーション

## 概要

Next.jsとVercel AI SDKを使用して構築された、モダンでスケーラブルなチャットアプリケーションです。

## ✨ 主な機能

- **リアルタイムなAIとの対話**: AIとリアルタイムでスムーズな会話ができます。
- **ストリーミング応答**: AIの応答がトークンごとにストリーミングされるため、ユーザーは素早いフィードバックを得られます。
- **モダンなUI**: Tailwind CSSで構築された、クリーンでレスポンシブなユーザーインターフェース。
- **スケーラブルなアーキテクチャ**: [bulletproof-react](https://github.com/alan2207/bulletproof-react)の設計思想を参考に、将来の機能拡張を見据えたスケーラビリティとメンテナンス性の高い構成を採用しています。

## 🛠️ 技術スタック

- **フレームワーク**: [Next.js](https://nextjs.org/)
- **言語**: [TypeScript](https://www.typescriptlang.org/)
- **UI**: [React](https://react.dev/) & [Tailwind CSS](https://tailwindcss.com/)
- **AI連携**: [Vercel AI SDK](https://sdk.vercel.ai/)
- **テスト**: [Jest](https://jestjs.io/), [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- **コード品質**: [ESLint](https://eslint.org/), [Prettier](https://prettier.io/), [Husky](https://typicode.github.io/husky/), [lint-staged](https://github.com/okonet/lint-staged)

## 📂 プロジェクト構造

このプロジェクトでは、**bulletproof-react**の考え方に基づいた、機能ベースのディレクトリ構造を採用しています。このアプローチにより、アプリケーションが成長してもコードベースが整理され、スケーラビリティと保守性が向上します。

チャット機能に関連するコンポーネントやロジックは、すべて`src/features/chat/`ディレクトリに集約されています。

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

## 🧪 テストの実行 (Running Tests)

このプロジェクトでは、JestとReact Testing Libraryを使用してコンポーネントのテストを行っています。

テストをウォッチモードで実行するには（ファイルの変更を監視して自動で再実行します）

```bash
pnpm test
```
