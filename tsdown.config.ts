import { defineConfig } from "tsdown";
import packageJson from "./package.json" assert { type: "json" };

function extractPeerDependencies() {
  const peerDependencies = packageJson.peerDependencies || {};
  const extractedPeerDependencies = Object.keys(peerDependencies);
  return extractedPeerDependencies;
}

export default defineConfig({
  entry: {
    "bin/index": "src/bin/index.ts",
    "dev/index": "src/dev/index.ts",
    "server/index": "src/server/index.ts",
    "server/node/index": "src/server/node/index.ts",
    "client/index": "src/client/index.ts",
    "cli/index": "src/cli/index.ts",
  },
  copy: [
    { from: "src/dev/biome/base.json", to: "dist/dev/biome/base.json" },
    { from: "src/dev/tsconfig/base.json", to: "dist/dev/tsconfig/base.json" },
    {
      from: "src/bin/templates/cli/index.ts.ejs",
      to: "dist/bin/templates/cli/index.ts.ejs",
    },
    {
      from: "src/bin/templates/server/index.ts.ejs",
      to: "dist/bin/templates/server/index.ts.ejs",
    },
  ],
  dts: true,
  tsconfig: "tsconfig.build.json",
  format: "esm",
  sourcemap: true,
  external: extractPeerDependencies(),
});
