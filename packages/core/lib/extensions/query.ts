import type { Linter } from "eslint";

import type { ExtensionFactory } from "./types";

export default (async ({ override }) => {
  const query = (await import("@tanstack/eslint-plugin-query")).default;
  const configs: Linter.Config[] = [
    ...query.configs["flat/recommended"],
    override ?? {},
  ];

  return configs.filter((config) => Object.keys(config).length > 0);
}) satisfies ExtensionFactory;
