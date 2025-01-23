import type { Linter } from "eslint";

export interface ExtensionOptions {
  typed?: true;
  ignores?: string[];
  override?: Linter.Config;
}

export type ExtensionFactory = (
  options: ExtensionOptions,
) => Promise<Linter.Config[]>;
