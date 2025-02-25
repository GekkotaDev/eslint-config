import type { Linter } from "eslint";

import command from "eslint-plugin-command/config";
import eslint from "@eslint/js";
import fp from "eslint-plugin-functional";
import gitignore from "eslint-config-flat-gitignore";
import jsdoc from "eslint-plugin-jsdoc";
import perfectionist from "eslint-plugin-perfectionist";
// @ts-expect-error: no type definitions
import promise from "eslint-plugin-promise";
import unicorn from "eslint-plugin-unicorn";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import stylisticJs from "@stylistic/eslint-plugin-js";
import stylisticJsx from "@stylistic/eslint-plugin-jsx";
import stylisticTs from "@stylistic/eslint-plugin-ts";
import ts from "typescript-eslint";

export const head = [
  eslint.configs.recommended,
  perfectionist.configs["recommended-natural"],
  promise.configs["flat/recommended"],
  unicorn.configs["flat/recommended"],
] satisfies Linter.Config[];

export const tail = [
  {
    ...jsdoc.configs["flat/recommended"],
    files: ["**/*.js", "**/*.cjs", "**/*.mjs", "**/*.jsx"],
  },
  {
    ...jsdoc.configs["flat/recommended-typescript"],
    files: [
      "**/*.ts",
      "**/*.cts",
      "**/*.mts",
      "**/*.tsx",
      "**/*.astro",
      "**/*.svelte",
    ],
  },
  {
    rules: {
      "no-undef": "off",
      "jsdoc/tag-lines": "off",
    },
  },
  command(),
  gitignore(),
] satisfies Linter.Config[];

export const functional = ({
  files,
  ignores,
}: Partial<{
  files: string[];
  ignores: string[];
}>) =>
  ({
    base: [
      {
        ...fp.configs.off,
      } as Linter.Config,
    ],
    "with-currying": [
      {
        files,
        ignores,
        rules: {
          "functional/functional-parameters": "error",
        },
      },
    ],
    "no-exceptions": [
      {
        files,
        ignores,
        rules: {
          "functional/no-throw-statements": "error",
        },
      },
    ],
    "no-inheritance": [
      {
        files,
        ignores,
        rules: {
          "functional/no-class-inheritance": "error",
        },
      },
    ],
    "no-loops": [
      {
        files,
        ignores,
        rules: {
          "functional/no-loop-statements": "error",
        },
      },
    ],
    "no-mutability": [
      {
        files,
        ignores,
        rules: {
          "@typescript-eslint/prefer-readonly": "error",
          "functional/immutable-data": "error",
          "functional/no-let": "error",
          "functional/type-declaration-immutability": "error",
          "functional/no-mixed-types": "error",
          "no-param-reassign": "error",
          "no-var": "error",
          "prefer-const": "error",

          "unicorn/no-array-for-each": "off",
        },
      },
    ],
    "no-side-effects": [
      {
        files,
        ignores,
        rules: {
          "functional/no-expression-statements": "error",
          "functional/no-return-void": "error",

          "unicorn/no-useless-undefined": "off",
        },
      },
    ],
  }) as const satisfies Record<string, Linter.Config[]>;

export const typescript = (
  options: Partial<{ typed?: true; tsconfigRootDir: string }>,
): Linter.Config[] =>
  typeof options.typed === "undefined"
    ? [...(ts.configs.recommended as Linter.Config[])]
    : [
        ...(ts.configs.recommendedTypeChecked as Linter.Config[]),
        {
          languageOptions: {
            parserOptions: {
              projectService: options.typed,
              tsconfigRootDir: options.tsconfigRootDir,
            },
          },
        },
        {
          files: ["**/*.js"],
          ...(ts.configs.disableTypeChecked as Linter.Config),
        },
      ];

export const stylistic = (
  options: Partial<{ groups: string[][] }>,
): Linter.Config[] =>
  [
    {
      plugins: {
        "@stylistic/js": stylisticJs,
      },

      rules: {
        "@stylistic/js/object-curly-newline": [
          "error",
          {
            ExportDeclaration: "never",
            ImportDeclaration: "never",
            ObjectExpression: {
              minProperties: 1,
            },
            ObjectPattern: {
              multiline: true,
            },
          },
        ],
        "@stylistic/js/object-property-newline": [
          "error",
          {
            allowAllPropertiesOnSameLine: false,
          },
        ],
      },
    },
    {
      plugins: {
        "@stylistic/ts": stylisticTs,
      },

      rules: {},
    },
    {
      plugins: {
        "@stylistic/jsx": stylisticJsx,
      },

      rules: {
        "@stylistic/jsx/jsx-sort-props": "warn",
      },
    },
    {
      plugins: {
        "simple-import-sort": simpleImportSort,
      },

      rules: {
        "simple-import-sort/exports": "warn",
        "simple-import-sort/imports": [
          "warn",
          {
            groups: options.groups,
          },
        ],
      },
    },
    {
      rules: {
        // Handled by eslint-plugin-simple-import-sort.
        "perfectionist/sort-exports": "off",
        "perfectionist/sort-imports": "off",
        "perfectionist/sort-named-exports": "off",
        "perfectionist/sort-named-imports": "off",
      },
    },
  ] satisfies Linter.Config[];
