import type { Linter } from "eslint";

import type { ExtensionFactory } from "./types";

export default (async ({ override, ignores = [] }) => {
  const solid = await import("eslint-plugin-solid");
  const tsParser = (await import("@typescript-eslint/parser")).default;

  const configs: Linter.Config[] = [
    {
      files: ["**/*.{ts,tsx,js,jsx}"],
      ...solid,
      languageOptions: {
        parser: tsParser,
      },
    },
  ];

  return configs;
}) satisfies ExtensionFactory;
