#!/usr/bin/env node
import path from "node:path";
import { existsSync } from "node:fs";
import { spawn } from "node:child_process";

// Lazy import vite only when needed
async function withVite() {
  const vite = await import("vite");
  return vite;
}

function hasUserViteConfig() {
  const cwd = process.cwd();
  const names = [
    "vite.config.ts",
    "vite.config.js",
    "vite.config.mts",
    "vite.config.mjs",
    "vite.config.cjs",
  ];
  return names.some((n) => existsSync(path.join(cwd, n)));
}

async function getDefaultViteConfig() {
  const mod = await import("../dev/vite");
  return mod.default ?? mod;
}

async function cmdDev() {
  const { createServer } = await withVite();
  const config = hasUserViteConfig() ? undefined : await getDefaultViteConfig();
  const server = await createServer({
    configFile: false,
    ...(config || {}),
  });
  await server.listen();
  server.printUrls();
}

async function cmdBuild() {
  const { build } = await withVite();
  const config = hasUserViteConfig() ? undefined : await getDefaultViteConfig();
  await build({ configFile: false, ...(config || {}) });
}

async function cmdPreview() {
  const { preview } = await withVite();
  const config = hasUserViteConfig() ? undefined : await getDefaultViteConfig();
  const server = await preview({ configFile: false, ...(config || {}) });
  server.printUrls();
}

async function cmdLint() {
  // Forward to biome if present
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
    console.log(`only <dev|build|preview|lint|format>`);
    process.exit(1);
}
