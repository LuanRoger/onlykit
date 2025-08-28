import { $ } from "execa";
import { Command } from "commander";
import path from "node:path";
import { normalizePath } from "../utils/path";
import { transformNodemon, transformTsDown } from "../transformers";
import { devSchema } from "./schemas";
import { pathExists } from "fs-extra";

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
    showBuilderLogs,
    showRunnerLogs,
  } = result;

  const cwd = path.resolve(parsedCwd);
  const inputPathResolved = path.resolve(cwd, parsedInputPath);

  const outputPathResolved = path.resolve(cwd, output);
  const outputFilePath = path.join(outputPathResolved, "index.mjs");
  const doesOutputPathExist = await pathExists(outputPathResolved);

  if (!doesOutputPathExist) {
    const { failed } = await $({
      stdout: showBuilderLogs ? transformTsDown : "ignore",
    })`tsdown ${normalizePath(inputPathResolved)} -d ${normalizePath(
      outputPathResolved
    )}`;
    if (failed) {
      process.exit(1);
    }
  }

  await Promise.all([
    $({
      stdout: showBuilderLogs ? transformTsDown : "ignore",
    })`tsdown --watch ${normalizePath(inputPathResolved)} -d ${normalizePath(
      outputPathResolved
    )}`,
    $({
      stdout: showRunnerLogs ? transformNodemon : "ignore",
    })`nodemon ${normalizePath(outputFilePath)}`,
  ]);
}

export const devCommand = new Command()
  .command("dev")
  .description("Start the development server")
  .argument(
    "<inputPath>",
    "Path to the input file or directory. This will be watched by the builder."
  )
  .option("--output <path>", "Set the output entrypoint", "./dist")
  .option("--execute <filePath>", "File to execute after build", "index.mjs")
  .option("--show-builder-logs", "Show builder logs", false)
  .option("--show-runner-logs", "Show runner logs", true)
  .option(
    "-c, --cwd <path>",
    "Set the current working directory",
    process.cwd()
  )
  .action(devAction);
