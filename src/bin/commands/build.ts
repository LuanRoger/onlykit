import path from "node:path";
import { Command } from "commander";
import { exists } from "fs-extra";
import { TsDownBuildExecutor } from "../processes/executors";
import { buildSchema } from "./schemas";

// biome-ignore lint/suspicious/noExplicitAny: The type of options is not known at this point, so we use any.
async function buildAction(inputPath: string, options: any) {
  const result = buildSchema.parse({
    inputPath,
    ...options,
  });

  const { cwd, inputPath: parsedInputPath, config, output } = result;

  const resolvedCwd = path.resolve(cwd);
  const inputPathResolved = path.resolve(resolvedCwd, parsedInputPath);
  const outputPathResolved = path.resolve(resolvedCwd, output);
  const configPathResolved = path.resolve(resolvedCwd, config);

  const doesConfigPathExist = await exists(configPathResolved);

  const tsDownExecutor = new TsDownBuildExecutor(
    {
      inputPath: inputPathResolved,
      outputPath: outputPathResolved,
      watch: options.watch,
      configPath: doesConfigPathExist ? configPathResolved : undefined,
    },
    false,
    true,
  );

  await tsDownExecutor.execute();
}

export const buildCommand = new Command()
  .command("build")
  .description("Build the project for production")
  .argument("<inputPath>", "Path to the input file or directory.")
  .option("--output <path>", "Set the output entrypoint", "./dist")
  .option("--show-builder-logs", "Show builder logs", false)
  .option(
    "-c, --config <configPath>",
    "Path to the config file",
    "./tsdown.config.ts",
  )
  .option("--cwd <path>", "Set the current working directory", process.cwd())
  .action(buildAction);
