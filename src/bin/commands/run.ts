import { Command } from "commander";
import { runSchema } from "./schemas";
import path from "node:path";
import { StandaloneEnvironment } from "../standalone";
import { normalizePath } from "../utils/path";
import { $ } from "execa";
import ora from "ora";
import { createTsConfig } from "../files";

// biome-ignore lint/suspicious/noExplicitAny: The type of options is not known at this point, so we use any.
async function runAction(entryPoint: string, options: any) {
  const result = runSchema.parse({
    entryPoint,
    ...options,
  });

  const { entryPoint: parsedEntryPoint, cwd: parsedCwd, noTsconfig } = result;

  const cwd = path.resolve(parsedCwd);
  const entryPointResolved = path.resolve(cwd, parsedEntryPoint);
  const standaloneEnv = new StandaloneEnvironment(cwd);

  async function cleanup() {
    await standaloneEnv.clean();
  }

  await standaloneEnv.setup();
  process.on("SIGINT", cleanup);
  process.on("SIGTERM", cleanup);
  process.on("exit", cleanup);

  const spinner = ora("Building project...").start();

  if (!noTsconfig) {
    await createTsConfig(cwd);
  }
  const { failed } = await $({
    stdout: "ignore",
  })`tsdown ${normalizePath(entryPointResolved)} -d ${normalizePath(
    standaloneEnv.standaloneOutputPath
  )}`;
  if (failed) {
    process.exit(1);
  }
  spinner.succeed("Project built successfully");
  spinner.clear();

  try {
    await $({
      stdout: "inherit",
    })`node ${normalizePath(standaloneEnv.standaloneOutputEntryPoint)}`;
  } finally {
    await cleanup();
  }
}

export const runCommand = new Command("run")
  .description("Run your project in standalone mode")
  .argument("<entryPoint>", "Path to the entry point file")
  .option("--watch", "Watch for file changes and re-run", false)
  .option("--no-tsconfig", "Do not use tsconfig.json", false)
  .option("--cwd <path>", "Set the current working directory", process.cwd())
  .action(runAction);
