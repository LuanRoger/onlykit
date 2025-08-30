import path from "node:path";
import { Command } from "commander";
import ora from "ora";
import { createTsConfig } from "../files";
import {
  NodeExecuteExecutor,
  TsDownBuildExecutor,
} from "../processes/executors";
import { StandaloneEnvironment } from "../standalone";
import { addExitHook } from "../utils/process";
import { runSchema } from "./schemas";

// biome-ignore lint/suspicious/noExplicitAny: The type of options is not known at this point, so we use any.
async function runAction(entryPoint: string, options: any) {
  const result = runSchema.parse({
    entryPoint,
    ...options,
  });

  const { entryPoint: parsedEntryPoint, cwd: parsedCwd, tsconfig } = result;

  const cwd = path.resolve(parsedCwd);
  const entryPointResolved = path.resolve(cwd, parsedEntryPoint);
  const standaloneEnv = new StandaloneEnvironment(cwd);

  async function cleanup() {
    await standaloneEnv.clean();
  }

  await standaloneEnv.setup();
  addExitHook(cleanup);

  const spinner = ora("Building project...").start();

  if (!tsconfig) {
    await createTsConfig(cwd);
  }
  const tsDownExecutor = new TsDownBuildExecutor(
    {
      inputPath: entryPointResolved,
      outputPath: standaloneEnv.standaloneOutputPath,
    },
    true,
    false,
  );
  await tsDownExecutor.execute();
  spinner.stop();
  spinner.clear();

  try {
    const nodeExecutor = new NodeExecuteExecutor({
      inputPath: standaloneEnv.standaloneOutputEntryPoint,
    });
    await nodeExecutor.execute();
  } finally {
    await cleanup();
  }
}

export const runCommand = new Command("run")
  .description("Run your project in standalone mode")
  .argument("<entryPoint>", "Path to the entry point file")
  .option("--no-tsconfig", "Do not generate a tsconfig.json file", true)
  .option("--cwd <path>", "Set the current working directory", process.cwd())
  .action(runAction);
