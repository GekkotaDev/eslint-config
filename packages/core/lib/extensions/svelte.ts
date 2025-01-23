import type { Linter } from "eslint";

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
    { files: ["**/*.svelte"], ignores },
  ];

  return configs.filter((config) => Object.keys(config).length > 0);
}) satisfies ExtensionFactory;
