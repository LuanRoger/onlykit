import { defineConfig } from "rolldown";
import { copyJson } from "./lib";

export default defineConfig([
  // CLI
  {
    input: "src/cli/index.ts",
    output: {
      file: "dist/cli/index.js",
      format: "es",
      sourcemap: true,
      inlineDynamicImports: true,
    },
    external: [
      "node:path",
      "node:fs",
      "node:child_process",
      "rollup",
      "@rollup/plugin-typescript",
      "@rollup/plugin-node-resolve",
      "@rollup/plugin-commonjs",
    ],
  },
  // Server (Hono: https://github.com/honojs/hono)
  {
    input: "src/server/index.ts",
    output: [
      {
        file: "dist/server/index.js",
        format: "es",
        sourcemap: true,
      },
      {
        file: "dist/server/index.cjs",
        format: "cjs",
        exports: "named",
        sourcemap: true,
      },
    ],
  },
  {
    input: "src/server/node/index.ts",
    output: [
      {
        file: "dist/server/node/index.js",
        format: "es",
        sourcemap: true,
      },
      {
        file: "dist/server/node/index.cjs",
        format: "cjs",
        exports: "named",
        sourcemap: true,
      },
    ],
  },
  // Client (KY: https://github.com/sindresorhus/ky)
  {
    input: "src/client/index.ts",
    output: [
      {
        file: "dist/client/index.js",
        format: "es",
        sourcemap: true,
      },
      {
        file: "dist/client/index.cjs",
        format: "cjs",
        exports: "named",
        sourcemap: true,
      },
    ],
  },
  // Dev (Vite: https://vitejs.dev, Biome: https://biomejs.org, TypeScript: https://www.typescriptlang.org)
  {
    input: "src/dev/index.ts",
    external: ["vite", "node:path"],
    plugins: [copyJson()],
    output: [
      {
        file: "dist/dev/index.js",
        format: "es",
        sourcemap: true,
        inlineDynamicImports: true,
      },
      {
        file: "dist/dev/index.cjs",
        format: "cjs",
        exports: "named",
        sourcemap: true,
        inlineDynamicImports: true,
      },
    ],
  },
]);
