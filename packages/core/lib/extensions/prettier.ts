import type { Linter } from "eslint";
import type { ExtensionFactory } from "./types";

export default (async () => {
  const configs: Linter.Config[] = [
    // @ts-expect-error no type declarations.
    await import("eslint-config-prettier"),
  ];

  try {
    const svelte = (await import("eslint-plugin-svelte")).default.configs[
      "flat/prettier"
    ];

    configs.push(...svelte);
  } catch {}

  return configs;
}) satisfies ExtensionFactory;
