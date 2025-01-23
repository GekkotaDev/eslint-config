import type { ESLint, Linter } from "eslint";

import type { ExtensionOptions } from "./extensions/types.js";

import * as extension from "./extensions";
import { head, tail, functional, typescript, stylistic } from "./configs.js";
import processors from "./processors.js";

export interface Options {
  _DEBUG: boolean;

  /** Global array of files to ignore */
  ignores: string[];

  /**
   * Order which imports are sorted by. These are automatically fixable by
   * ESLint.
   */
  importOrder: string[][];

  /** Global configuration override. */
  overrides: Linter.Config[];

  /** Opt-in functional programming rules. */
  fp: (
    | "with-currying"
    | "no-exceptions"
    | "no-inheritance"
    | "no-loops"
    | "no-mutability"
    | "no-side-effects"
  )[];

  /** Directory containing the root `.tsconfig` */
  tsconfigRootDir: string;

  /** Location of all `.tsconfig` files in the repository. */
  tsconfigs: string[] | true;

  /**
   * Opt-in linter rulesets. These require their respective optional
   * dependencies to be installed.
   */
  extensions: Partial<{
    /**
     * Linting for Astro files.
     *
     * ### Requires:
     * - `eslint-plugin-astro`
     */
    astro: true | ExtensionOptions;

    /**
     * Disable conflicting Prettier rules.
     *
     * ### Requires:
     * - `eslint-config-prettier`
     *
     * ### Optional:
     * - `eslint-plugin-svelte`
     */
    prettier: true | ExtensionOptions;

    /**
     * Linting for Tanstack Query code.
     *
     * ### Requires
     * - `@tanstack/eslint-plugin`
     */
    query: true | ExtensionOptions;

    /**
     * Linting for Svelte components.
     *
     * ### Requires
     * - `eslint-plugin-svelte`
     */
    svelte: true | ExtensionOptions;

    /**
     * Linting for test files.
     *
     * ### Requires
     * - `@vitest/eslint-plugin`
     * - `eslint-plugin-testing-library`
     * - `eslint-plugin-jest-dom`
     *
     * ### Optional
     * - `eslint-plugin-playwright`
     * - `eslint-plugin-wdio`
     */
    test: true | ExtensionOptions;
  }>;
}

export const configs = async (
  options?: Partial<Options>,
): Promise<Linter.Config[]> => {
  const typed = Boolean(options?.tsconfigs) || undefined;

  let configs: Linter.Config[] = [...head];

  configs.push(
    ...typescript({
      tsconfigRootDir: options?.tsconfigRootDir,
      tsconfigs: options?.tsconfigs,
    }),
  );

  configs.push(...functional.base);

  if (options?.fp?.includes("no-exceptions"))
    configs.push(...functional["no-exceptions"]);

  if (options?.fp?.includes("no-inheritance"))
    configs.push(...functional["no-inheritance"]);

  if (options?.fp?.includes("no-loops"))
    configs.push(...functional["no-loops"]);

  if (options?.fp?.includes("no-mutability"))
    configs.push(...functional["no-mutability"]);

  if (options?.fp?.includes("no-side-effects"))
    configs.push(...functional["no-side-effects"]);

  if (options?.fp?.includes("with-currying"))
    configs.push(...functional["with-currying"]);

  if (options?.extensions?.query)
    configs.push(
      ...(await extension.query(
        typeof options.extensions.query === "boolean"
          ? { typed }
          : { typed, ...options.extensions.query },
      )),
    );

  if (options?.extensions?.svelte)
    configs.push(
      ...(await extension.svelte(
        typeof options.extensions.svelte === "boolean"
          ? { typed }
          : { typed, ...options.extensions.svelte },
      )),
    );

  if (options?.extensions?.astro)
    configs.push(
      ...(await extension.astro(
        typeof options.extensions.astro === "boolean"
          ? { typed }
          : { typed, ...options.extensions.astro },
      )),
    );

  if (options?.extensions?.test)
    configs.push(
      ...(await extension.test(
        typeof options.extensions.test === "boolean"
          ? { typed }
          : { typed, ...options.extensions.test },
      )),
    );

  if (options?.extensions?.prettier)
    configs.push(...(await extension.prettier()));

  configs.push(...stylistic({ groups: options?.importOrder }));
  configs.push(...tail);
  configs.push(...processors);
  configs.push(...(options?.overrides ?? []));
  configs.push({
    ignores: options?.ignores ?? [],
  });

  return configs.filter((config) => {
    if (typeof config === undefined) return;
    if (Object.keys(config).length < 1) return;
    if (Object.hasOwn(config, "0"))
      if (options?._DEBUG === true) {
        throw config;
      } else if (options?._DEBUG === false) {
        return true;
      } else {
        return;
      }
    return true;
  });
};
