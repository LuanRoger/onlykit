import { defineConfig } from "rolldown";

export default defineConfig([
  //Server (Hono)
  {
    input: "src/server/index.ts",
    output: {
      file: "dist/server/index.js",
      format: "es",
      sourcemap: true,
    },
  },
  {
    input: "dist/server/index.cjs",
    output: {
      format: "cjs",
      exports: "named",
      sourcemap: true,
    },
  },

  //Client (KY)
  {
    input: "src/client/index.ts",
    output: {
      file: "dist/client/index.js",
      format: "es",
      sourcemap: true,
    },
  },
  {
    input: "dist/client/index.cjs",
    output: {
      format: "cjs",
      exports: "named",
      sourcemap: true,
    },
  },
]);
