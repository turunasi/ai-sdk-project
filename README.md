# AIチャットアプリケーション

## 概要

Next.jsとVercel AI SDKを使用して構築された、モダンでスケーラブルなチャットアプリケーションです。

## ✨ 主な機能

- **リアルタイムなAIとの対話**: AIとリアルタイムでスムーズな会話ができます。
- **ストリーミング応答**: AIの応答がトークンごとにストリーミングされるため、ユーザーは素早いフィードバックを得られます。
- **モダンなUI**: Tailwind CSSで構築された、クリーンでレスポンシブなユーザーインターフェース。
- **ログイン機能**: ダミーの認証APIを使用した基本的なログイン機能を実装。
- **スケーラブルなアーキテクチャ**: [bulletproof-react](https://github.com/alan2207/bulletproof-react)の設計思想を参考に、将来の機能拡張を見据えたスケーラビリティとメンテナンス性の高い構成を採用しています。

## 🛠️ 技術スタック

- **フレームワーク**: [Next.js](https://nextjs.org/)
- **言語**: [TypeScript](https://www.typescriptlang.org/)
- **UI**: [React](https://react.dev/) & [Tailwind CSS](https://tailwindcss.com/)
- **認証**: [Auth.js (NextAuth.js)](https://authjs.dev/)
- **AI連携**: [Vercel AI SDK](https://sdk.vercel.ai/)
- **テスト**: [Jest](https://jestjs.io/), [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- **コード品質**: [ESLint](https://eslint.org/), [Prettier](https://prettier.io/), [Husky](https://typicode.github.io/husky/), [lint-staged](https://github.com/okonet/lint-staged)

## 📂 プロジェクト構造

このプロジェクトでは、**bulletproof-react**の考え方に基づいた、機能ベースのディレクトリ構造を採用しています。このアプローチにより、アプリケーションが成長してもコードベースが整理され、スケーラビリティと保守性が向上します。

各機能（例：チャット、認証、データベース）に関連するコンポーネントやロジックは、それぞれ`src/features/`以下の対応するディレクトリに集約されています。例えば、認証機能には、`actions`（サーバーアクション）、`components`（UI）、`lib`（Auth.js設定）が含まれます。

また、特定の機能に依存しない共通コンポーネントは`src/components/`に配置されます。例えば、`Sidebar.tsx`は汎用的なサイドバーのレイアウトを提供し、`MainLayout.tsx`がそれを組み込んでアプリケーション全体のレイアウトを構成します。`MainLayout.tsx`の中には`features/auth/components/UserSidebarContent.tsx`や`features/chat/components/ChatHistory.tsx`のような機能固有のコンポーネントが配置され、再利用性と関心の分離を実現しています。

```
src/
├── app/                      # Next.jsのApp Router。ルーティングとUIを定義
│   ├── api/                  # APIルート
│   │   ├── auth/[...auth]/route.ts # NextAuth.jsの認証API（サインイン、セッション等）
│   │   └── chat/
│   │       ├── history/route.ts    # チャット履歴をDBに保存するAPI
│   │       └── route.ts            # AIとのチャットストリーミングAPI
│   ├── chat/                   # チャット機能のページ
│   │   ├── [conversationId]/
│   │   │   ├── page.tsx            # 既存の会話ページ (Server Component)
│   │   │   └── ChatPageContent.tsx # チャットUI (Client Component)
│   │   └── page.tsx              # 新規チャット作成ページ (リダイレクト)
│   ├── login/page.tsx          # ログインページ
│   ├── signup/page.tsx         # 新規登録ページ
│   ├── layout.tsx              # アプリケーションのルートレイアウト
│   ├── page.tsx                # ルートページ (/)。/chatへリダイレクト
│   └── providers.tsx           # クライアントサイドのプロバイダー (SessionProvider)
├── components/                 # 機能に依存しない共通UIコンポーネント
│   ├── MainLayout.tsx          # サイドバーを含むメインレイアウト
│   └── Sidebar.tsx             # 汎用サイドバーコンポーネント
├── features/                   # 機能ごとのモジュール
│   ├── auth/                   # 認証機能
│   │   ├── actions/            # 認証関連のサーバーアクション
│   │   │   ├── login.ts        # ログイン処理
│   │   │   └── signup.ts       # 新規登録処理
│   │   ├── components/         # 認証関連のReactコンポーネント
│   │   │   ├── LoginForm.tsx   # ログインフォーム
│   │   │   ├── SignUpForm.tsx  # 新規登録フォーム
│   │   │   └── UserSidebarContent.tsx # サイドバーのユーザー情報表示
│   │   └── lib/
│   │       └── auth.ts         # Auth.js (NextAuth) の設定
│   ├── chat/                   # チャット機能
│   │   └── components/         # チャット関連のReactコンポーネント
│   │       ├── ChatHistory.tsx # チャット履歴リスト
│   │       ├── ChatInput.tsx   # メッセージ入力フォーム
│   │       ├── ChatList.tsx    # メッセージリスト
│   │       ├── ChatMessage.tsx # 個々のメッセージ
│   │       └── NewChatButton.tsx # 新規チャットボタン
│   └── database/               # データベース関連
│       ├── lib/prisma.ts       # Prisma Clientのシングルトンインスタンス
│       └── index.ts            # prismaインスタンスのエントリーポイント
├── lib/                        # プロジェクト全体で利用する共通ライブラリ (現在は未使用)
├── types/                      # 型定義ファイル
│   └── next-auth.d.ts          # NextAuth.jsのセッション型の拡張
└── middleware.ts               # Next.jsのミドルウェア (ルート保護)


```

また、`tsconfig.json`で設定されたパスエイリアス（`@/*`）を使用して、インポートパスを簡素化し、コードの可読性を向上させています。

## 🔐 認証 (Authentication)

このアプリケーションは Auth.js (NextAuth.js) を使用して、堅牢な認証システムを実装しています。サーバーアクションと`useActionState`フックを活用し、モダンなフォームハンドリングを実現しています。

- **認証フロー**:

  - **資格情報プロバイダー**: メールアドレスとパスワードによるログイン（`Credentials`プロバイダー）を実装しています。認証ロジックでは`bcryptjs`によるパスワードのハッシュ化と比較、`zod`による入力値の検証を行っています。
  - **新規登録**: ユーザーはメールアドレスとパスワードで新しいアカウントを作成できます。登録後、自動的にログイン状態になります。
  - **セッション管理**: `callbacks`を利用して、セッション情報にユーザーIDを含めるようにカスタマイズしています。これにより、クライアント側で認証ユーザーのIDを安全に利用できます。

- **ルート保護**:
  - Next.jsの**Middleware** (`src/middleware.ts`) を活用し、アプリケーションの主要なルート（`/login`, `/signup`などを除く）を保護しています。
  - 未認証のユーザーが保護されたページにアクセスしようとすると、自動的にログインページ (`/login`) にリダイレクトされます。

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

    プロジェクトのルートに`.env.local`ファイルを作成し、必要な環境変数を設定します。

    `Auth.js`が使用するシークレットキーを生成するために、次のコマンドを実行します。

    ```bash
    npx auth secret
    ```

    生成されたキーを`AUTH_SECRET`として、AIプロバイダーのAPIキーと共に`.env.local`ファイルにコピーします。

    ```.env.local
    AUTH_SECRET="your_auth_secret_here"
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

チャット機能や認証フォームなどの主要なUIコンポーネントに対する単体テストと統合テストが含まれています。

テストをウォッチモードで実行するには（ファイルの変更を監視して自動で再実行します）

```bash
pnpm test
```
