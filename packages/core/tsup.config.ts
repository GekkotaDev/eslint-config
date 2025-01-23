import { defineConfig } from "tsup";

export default defineConfig({
  format: ["esm", "cjs"],
  outDir: "dist",
  entry: ["lib/index.ts"],
  shims: true,
  dts: true,
});
