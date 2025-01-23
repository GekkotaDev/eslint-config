import type { Linter } from "eslint";

import type { ExtensionFactory } from "./types";

export default (async ({ ignores = [], override }) => {
  const astro = (await import("eslint-plugin-astro")).default;
  const configs: Linter.Config[] = [
    ...astro.configs.recommended,
    {
      rules: {
        "astro/sort-attributes": "warn",
      },
      ...override,
    },
    {
      files: ["**/*.astro"],
      ignores,
    },
  ];

  return configs.filter((config) => Object.keys(config).length > 0);
}) satisfies ExtensionFactory;
