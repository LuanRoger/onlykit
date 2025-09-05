import path from "node:path";
import { Command } from "commander";
import { exists } from "fs-extra";
import ora from "ora";
import { createTemplateFile, createTsConfig } from "../files";
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
  const standaloneEnv = new StandaloneEnvironment(cwd);
  const entryPointResolved = path.resolve(cwd, parsedEntryPoint);
  const tsDownConfig = path.join(cwd, "tsdown.config.ts");
  const tempTsdownConfig = path.join(
    standaloneEnv.standaloneOutputPath,
    "tsdown.config.ts",
  );

  const [doesTsConfigExist, doesTsDownConfigExist] = await Promise.all([
    exists(path.join(cwd, "tsconfig.json")),
    exists(tsDownConfig),
  ]);

  async function cleanup() {
    await standaloneEnv.clean();
  }
  addExitHook(cleanup);

  await standaloneEnv.setup();
  if (!doesTsDownConfigExist) {
    await createTemplateFile(
      tempTsdownConfig,
      "tsdown.config.ts.ejs",
      "config",
    );
  }
  if (!tsconfig && !doesTsConfigExist) {
    await createTsConfig(cwd);
  }

  const spinner = ora("Building project...").start();
  const tsDownExecutor = new TsDownBuildExecutor(
    {
      inputPath: entryPointResolved,
      outputPath: standaloneEnv.standaloneOutputPath,
      configPath: doesTsDownConfigExist ? tsDownConfig : tempTsdownConfig,
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
