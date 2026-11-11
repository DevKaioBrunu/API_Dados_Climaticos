module.exports = {
  testEnvironment: "node",
  roots: ["<rootDir>/backend/src"],
  testMatch: ["**/?(*.)+(spec|test).js"],
  collectCoverageFrom: [
    "backend/src/**/*.js",
    // Testes e checkRoutes.js não são implementação da API.
    "!backend/src/tests/**",
    // Arquivo vazio da base reaproveitada, sem papel na execução atual.
    "!backend/src/app.js",
  ],
  coverageProvider: "babel",
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov", "json-summary"],
  coverageThreshold: {
    global: { statements: 80 },
  },
};
