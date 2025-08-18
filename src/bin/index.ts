#!/usr/bin/env node

import { Command } from "commander";
import packageJson from "~/package.json";
import { devCommand as dev } from "./commands/dev";

async function main() {
  const program = new Command()
    .name("onlykit")
    .description("The only thing you need...")
    .version(packageJson.version, "-v, --version", "show the current version");

  program.addCommand(dev);

  program.parse();
}

main();

/*
import path from "node:path";
import { existsSync } from "node:fs";
import { spawn } from "node:child_process";

// Lazy import rollup only when needed
async function withRollup() {
  const mod = await import("rollup");
  return mod;
}

function hasUserRollupConfig() {
  const cwd = process.cwd();
  const names = [
    "rollup.config.ts",
    "rollup.config.js",
    "rollup.config.mts",
    "rollup.config.mjs",
    "rollup.config.cjs",
  ];
  return names.some((n) => existsSync(path.join(cwd, n)));
}

async function getDefaultRollupConfig() {
  const mod = await import("../dev/rollup");
  return mod.default ?? mod;
}

function findDefaultInput(): string | undefined {
  const cwd = process.cwd();
  const candidates = [
    "src/index.ts",
    "src/main.ts",
    "src/index.mts",
    "src/index.js",
    "src/index.mjs",
    "index.ts",
    "index.js",
  ];
  return candidates.map((p) => path.join(cwd, p)).find((p) => existsSync(p));
}

function spawnRollup(args: string[]) {
  const child = spawn("rollup", args, { stdio: "inherit" });
  child.on("exit", (code) => process.exit(code ?? 0));
}

async function cmdDev() {
  if (hasUserRollupConfig()) {
    // Delegate to user's config
    spawnRollup(["-cw"]);
    return;
  }

  const { watch } = await withRollup();
  const baseConfig: any = await getDefaultRollupConfig();
  const input = findDefaultInput();
  if (!input) {
    console.error(
      "No entry found. Create one of: src/index.ts, src/main.ts, src/index.js, or pass your own rollup.config.*",
    );
    process.exit(1);
  }
  const watchOptions = {
    ...baseConfig,
    input,
    watch: {},
  } as any;

  const watcher = watch(watchOptions);
  watcher.on("event", (e: any) => {
    if (e.code === "START") console.log("Rollup: watching for changes...");
    if (e.code === "BUNDLE_END") console.log("Built in", e.duration, "ms");
    if (e.code === "ERROR") console.error(e.error);
  });
}

async function cmdBuild() {
  if (hasUserRollupConfig()) {
    spawnRollup(["-c"]);
    return;
  }

  const { rollup } = await withRollup();
  const baseConfig: any = await getDefaultRollupConfig();
  const input = findDefaultInput();
  if (!input) {
    console.error(
      "No entry found. Create one of: src/index.ts, src/main.ts, src/index.js, or add rollup.config.*",
    );
    process.exit(1);
  }

  const bundle = await rollup({ ...baseConfig, input } as any);
  const outputs = Array.isArray(baseConfig.output)
    ? baseConfig.output
    : [baseConfig.output];
  for (const out of outputs) {
    await bundle.write(out);
  }
  await bundle.close();
}

async function cmdPreview() {
  console.log(
    "Preview is not available for Rollup. Serve your 'dist' folder with any HTTP server.",
  );
}

async function cmdLint() {
  const child = spawn("biome", ["check", "."], { stdio: "inherit" });
  child.on("exit", (code) => process.exit(code ?? 0));
}

async function cmdFormat() {
  const child = spawn("biome", ["format", "--write", "."], {
    stdio: "inherit",
  });
  child.on("exit", (code) => process.exit(code ?? 0));
}

const cmd = process.argv[2] ?? "dev";
switch (cmd) {
  case "dev":
    await cmdDev();
    break;
  case "build":
    await cmdBuild();
    break;
  case "preview":
    await cmdPreview();
    break;
  case "lint":
    await cmdLint();
    break;
  case "format":
    await cmdFormat();
    break;
  default:
    console.log(`only <dev|build|lint|format>`);
    process.exit(1);
}
 */
