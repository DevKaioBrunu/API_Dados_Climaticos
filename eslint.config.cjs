const js = require("@eslint/js");
const globals = require("globals");

module.exports = [
  { ignores: ["**/node_modules/**", "coverage/**", "X/**"] },
  {
    ...js.configs.recommended,
    files: ["backend/src/**/*.js", "frontend/js/**/*.js", "*.config.cjs"],
  },
  {
    files: ["backend/src/**/*.js", "*.config.cjs"],
    languageOptions: {
      sourceType: "commonjs",
      globals: globals.node,
    },
  },
  {
    files: ["backend/src/tests/**/*.{test,spec}.js"],
    languageOptions: { globals: globals.jest },
  },
  {
    files: ["frontend/js/**/*.js"],
    languageOptions: {
      sourceType: "script",
      globals: globals.browser,
    },
  },
  {
    // api.js disponibiliza este objeto ao app.js por scripts do navegador.
    files: ["frontend/js/app.js"],
    languageOptions: { globals: { ApiClient: "readonly" } },
  },
];
