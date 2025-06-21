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
  // Handle ESM modules in node_modules
  transformIgnorePatterns: [
    "/node_modules/(?!(next-auth|@auth/core|@ai-sdk/react|jest-runtime)/)",
    "^.+\\.module\\.(css|sass|scss)$",
  ],
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
};

// createJestConfig is an async function that returns a Jest config -
// so we have to export a promise
export default createJestConfig(config);
