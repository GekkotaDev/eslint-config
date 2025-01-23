import type { Linter } from "eslint";

import markdown from "@eslint/markdown";

export default [
  {
    files: ["**/*.md"],
    plugins: {
      markdown,
    },
    processor: "markdown/markdown",
  },
  {
    files: ["**/*.md/*.js", "**/*.md/*.ts"],
    rules: {
      "no-undef": "off",
      "no-unused-expressions": "off",
      "no-unused-vars": "off",
      "padded-blocks": "off",
    },
  },
] satisfies Linter.Config[];
