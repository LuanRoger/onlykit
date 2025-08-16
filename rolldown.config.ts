import { defineConfig } from "rolldown";

export default defineConfig([
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
]);
