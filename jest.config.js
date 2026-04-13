module.exports = {
  rootDir: ".",
  testEnvironment: "node",
  testTimeout: 15000,
  maxWorkers: 1,
  collectCoverage: true,
  coverageProvider: "v8",
  collectCoverageFrom: [
    "cli/**/*.js",
    "server/**/*.js",
    "!cli/supercli.js",
    "!cli/plugin-agency-agents.js",
    "!server/public/**"
  ],
  testPathIgnorePatterns: ["/node_modules/", "/ref-btcbot/"],
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov", "clover"],
  coverageThreshold: {
    global: {
      branches: 10,
      functions: 10,
      lines: 10,
      statements: 10
    }
  }
}
