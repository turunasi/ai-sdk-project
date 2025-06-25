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

export default async () => {
  const jestConfig = await createJestConfig(config)();

  jestConfig.transformIgnorePatterns = [
    "/node_modules/(?!next-auth|@auth/core|jose|ai|react-sdk)/", // 'ai-sdk/react' を 'ai' と 'react-sdk' に一般化しました

    "^.+\\.module\\.(css|sass|scss)$",
  ];

  // 最終的に加工した設定オブジェクトを返します。
  return jestConfig;
};
