import type { Linter } from "eslint";

import type { ExtensionFactory } from "./types";

export default (async ({ override, ignores = [] }) => {
  const svelteParser = (await import("svelte-eslint-parser")).default;
  const typescriptParser = (await import("@typescript-eslint/parser")).default;

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
      files: ["**/*.svelte.ts", "**/*.svelte.*.ts"],
      rules: {
        /*
          This conflicts with runes where reassignments and to a limited extent
          mutations are used for reactivity.
         */
        "functional/no-let": "off",

        /*
          It is impossible NOT to invoke a function for its side effects in
          Svelte(Kit) contexts such as the navigation APIs or the $effect rune.
         */
        "functional/no-expression-statements": "off",
      },
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

      rules: {
        /* Template conflicts */
        "@typescript-eslint/no-unsafe-call": "off",
        "@typescript-eslint/no-unused-vars": "off",

        /*
          It is impossible NOT to invoke a function for its side effects in
          Svelte(Kit) contexts such as the navigation APIs or the $effect rune.
         */
        "functional/no-expression-statements": "off",

        "unicorn/filename-case": "off",
        "unicorn/no-object-as-default-parameter": "off",
      },
    },
  ];

  return configs.filter((config) => Object.keys(config).length > 0);
}) satisfies ExtensionFactory;
