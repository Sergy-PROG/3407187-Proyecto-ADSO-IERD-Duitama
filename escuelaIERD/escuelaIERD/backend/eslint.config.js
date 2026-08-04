const js = require("@eslint/js");
const globals = require("globals");

module.exports = [
  {
    files: ["**/*.js"],
    languageOptions: {
      globals: {
        ...globals.node,
      },
      sourceType: "commonjs",
    },
    ...js.configs.recommended,
  },
  {
    files: ["test/**/*.js", "**/*.test.js"],
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
  },
];