import { defineConfig } from "tsdown";
import packageJson from "./package.json" assert { type: "json" };

function extractPeerDependencies() {
  const peerDependencies = packageJson.peerDependencies || {};
  const extractedPeerDependencies = Object.keys(peerDependencies);
  return extractedPeerDependencies;
}

export default defineConfig({
  entry: {
    "cli/index": "src/cli/index.ts",
    "dev/index": "src/dev/index.ts",
    "server/index": "src/server/index.ts",
    "server/node/index": "src/server/node/index.ts",
    "client/index": "src/client/index.ts",
  },
  copy: [
    { from: "src/dev/biome/biome.json", to: "dist/dev/biome/biome.json" },
    { from: "src/dev/ts-config/base.json", to: "dist/dev/ts-config/base.json" },
  ],
  dts: true,
  tsconfig: "tsconfig.build.json",
  format: "esm",
  sourcemap: true,
  external: extractPeerDependencies(),
});
