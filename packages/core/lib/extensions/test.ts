import type { Linter } from "eslint";

import type { ExtensionFactory } from "./types";

export default (async ({ typed }) => {
  const testingLibrary = (await import("eslint-plugin-testing-library"))
    .default;
  const vitest = (await import("@vitest/eslint-plugin")).default;
  const dom = (await import("eslint-plugin-jest-dom")).default;
  let playwright = undefined;
  let webdriverio = undefined;

  try {
    playwright = (await import("eslint-plugin-playwright")).default;
  } catch {}

  try {
    webdriverio = await import("eslint-plugin-wdio");
  } catch {}

  const configs: Linter.Config[] = [
    {
      files: ["**/*.spec.ts"],
      ...vitest.configs.recommended,

      rules: {
        ...vitest.configs.recommended.rules,
        "unicorn/filename-case": "off",
        "vitest/valid-expect": "off",
      },

      settings: {
        vitest: {
          typecheck: typed,
        },
      },

      languageOptions: {
        globals: typed ? { ...vitest.environments.env.globals } : undefined,
      },
    },
    {
      files: ["**/*.spec.ts"],
      ignores: ["**/*.svelte.spec.ts"],
      ...testingLibrary.configs["flat/dom"],
      ...dom.configs["flat/recommended"],
    },
    {
      files: ["**/*.svelte.spec.ts"],
      ...testingLibrary.configs["flat/svelte"],
      ...dom.configs["flat/recommended"],
    },
    playwright
      ? {
          ...playwright.configs["flat/recommended"],
          files: ["**/e2e/**"],
          rules: {
            ...playwright.configs["flat/recommended"].rules,
          },
        }
      : {},
    webdriverio
      ? {
          ...webdriverio.configs["flat/recommended"],
          files: ["**/e2e/**"],
        }
      : {},
  ];

  return configs.filter(
    (config) => Object.keys(config).length > 0 || config !== undefined,
  );
}) satisfies ExtensionFactory;
