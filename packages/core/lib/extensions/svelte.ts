import type { Linter } from "eslint";
import * as svelteParser from "svelte-eslint-parser";
import * as typescriptParser from "@typescript-eslint/parser";

import type { ExtensionFactory } from "./types";

export default (async ({ override, ignores = [] }) => {
  const svelte = (await import("eslint-plugin-svelte")).default;
  const configs: Linter.Config[] = [
    ...svelte.configs["flat/recommended"],
    {
      rules: {
        "svelte/derived-has-same-inputs-outputs": "error",
        "svelte/sort-attributes": "warn",
        "svelte/spaced-html-comment": "warn",
      },
      ...override,
    },
    {
      files: ["**/*.svelte"],
      ignores,
      languageOptions: {
        parser: svelteParser,
        parserOptions: {
          parser: typescriptParser,
          extraFileExtensions: [".svelte"],
        },
      },
    },
  ];

  return configs.filter((config) => Object.keys(config).length > 0);
}) satisfies ExtensionFactory;
