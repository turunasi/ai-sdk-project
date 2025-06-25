import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: "./",
});

// Add any custom config to be passed to Jest
/** @type {import('jest').Config} */
const config = {
  // テスト実行時に詳細な情報を表示
  verbose: true,

  // カバレッジレポートを収集
  collectCoverage: true,

  // カバレッジレポートの出力ディレクトリ
  coverageDirectory: "coverage",

  // カバレッジレポートの形式
  coverageReporters: ["json", "lcov", "text", "clover"],

  // Add more setup options before each test is run
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testEnvironment: "jest-environment-jsdom",
  moduleDirectories: ["node_modules", "<rootDir>/"],

  moduleNameMapper: {
    // Handle module aliases (this will be automatically configured for you soon)
    "^@/(.*)$": "<rootDir>/src/$1",
  },

  // カバレッジを収集するファイルのパターン (必要に応じて調整)
  collectCoverageFrom: [
    "src/**/*.{ts,tsx,js,jsx}",
    "!src/**/*.d.ts",
    "!src/**/__tests__/**",
  ],

  reporters: [
    "default", // デフォルトのコンソールレポーター
    [
      "jest-junit",
      {
        outputDirectory: "reports", // 出力先ディレクトリ
        outputName: "report.html", // 出力ファイル名
      },
    ],
  ],
};

// createJestConfigは非同期で設定を返すため、以下のように非同期関数でエクスポートします。
export default async () => {
  // まず、Next.jsの基本設定を含んだJest設定を非同期で生成します。
  const jestConfig = await createJestConfig(config)();

  // 次に、Next.jsが生成した設定のうち、transformIgnorePatternsだけを意図通りに上書きします。
  jestConfig.transformIgnorePatterns = [
    // node_modules内のパッケージで、トランスパイル（変換）が必要なものをここで指定します。
    // (?!...) は否定先読みで、「指定したパッケージ"以外"を無視する」という意味になります。
    "/node_modules/(?!next-auth|@auth/core|jose|ai|react-sdk)/", // 'ai-sdk/react' を 'ai' と 'react-sdk' に一般化しました

    // Next.jsのデフォルトに含まれるCSS Modules用のパターンも維持します。
    "^.+\\.module\\.(css|sass|scss)$",
  ];

  // 最終的に加工した設定オブジェクトを返します。
  return jestConfig;
};
