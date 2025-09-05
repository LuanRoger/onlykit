import fs from "node:fs";
import path from "node:path";
import { Command } from "commander";
import { pathExists } from "fs-extra";
import {
  NodemonExecuteExecutor,
  TsDownBuildExecutor,
} from "../processes/executors";
import { devSchema } from "./schemas";

// biome-ignore lint/suspicious/noExplicitAny: The type of options is not known at this point, so we use any.
async function devAction(inputPath: string, options: any) {
  const result = devSchema.parse({
    inputPath,
    ...options,
  });

  const {
    cwd: parsedCwd,
    inputPath: parsedInputPath,
    output,
    execute,
    showBuilderLogs,
    showRunnerLogs,
  } = result;

  const cwd = path.resolve(parsedCwd);
  const inputPathResolved = path.resolve(cwd, parsedInputPath);
  const outputPathResolved = path.resolve(cwd, output);
  const outputFilePath = path.join(outputPathResolved, execute);
  const tsdownConfig = path.join(cwd, "tsdown.config.ts");

  const doesOutputPathExist = await pathExists(outputFilePath);
  const doesTsDownConfigExist = await pathExists(tsdownConfig);

  if (!doesOutputPathExist) {
    const inputIsPathFile = fs.lstatSync(inputPathResolved).isFile();
    const entryFileName = inputIsPathFile
      ? inputPathResolved
      : path.join(inputPathResolved, "index.ts");
    const doesEntryFileExists = await pathExists(entryFileName);
    if (!doesEntryFileExists) {
      console.error(`Entry file ${entryFileName} does not exist.`);
      process.exit(1);
    }

    const initialBuildExecutor = new TsDownBuildExecutor(
      {
        inputPath: entryFileName,
        outputPath: outputPathResolved,
        configPath: doesTsDownConfigExist ? tsdownConfig : undefined,
      },
      !showBuilderLogs,
      true,
    );
    await initialBuildExecutor.execute();
  }

  const tsDownExecutor = new TsDownBuildExecutor(
    {
      inputPath: inputPathResolved,
      outputPath: outputPathResolved,
      configPath: doesTsDownConfigExist ? tsdownConfig : undefined,
      watch: true,
    },
    !showBuilderLogs,
    false,
  );
  const nodemonExecutor = new NodemonExecuteExecutor(
    {
      inputPath: outputFilePath,
      watchPath: outputPathResolved,
    },
    !showRunnerLogs,
    false,
  );
  await Promise.all([tsDownExecutor.execute(), nodemonExecutor.execute()]);
}

export const devCommand = new Command()
  .command("dev")
  .description("Start the development server")
  .argument(
    "<inputPath>",
    "Path to the input file or directory. This will be watched by the daemon.",
  )
  .option("--output <path>", "Set the output directory", "./dist")
  .option("--execute <filePath>", "File to execute after build", "index.mjs")
  .option("--show-builder-logs", "Show builder logs", false)
  .option("--show-runner-logs", "Show runner logs", true)
  .option(
    "-c, --cwd <path>",
    "Set the current working directory",
    process.cwd(),
  )
  .action(devAction);
