/*
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

module.exports = {
  testEnvironment: "node",
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  projects: [
    {
      displayName: "unit",
      testMatch: ["<rootDir>/test/unit/**/*.ts"],
      preset: "ts-jest",
    },
    {
      displayName: "e2e",
      testMatch: ["<rootDir>/test/e2e/tests/**/*.ts"],
      preset: "ts-jest",
    },
  ],
};
