import { $ } from "execa";
import { Command } from "commander";
import path from "node:path";
import fs from "node:fs";
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
    execute,
    showBuilderLogs,
    showRunnerLogs,
  } = result;

  const cwd = path.resolve(parsedCwd);
  const inputPathResolved = path.resolve(cwd, parsedInputPath);

  const outputPathResolved = path.resolve(cwd, output);
  const outputFilePath = path.join(outputPathResolved, execute);
  const doesOutputPathExist = await pathExists(outputFilePath);

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

    const { failed } = await $({
      stdout: showBuilderLogs ? transformTsDown : "ignore",
    })`tsdown ${normalizePath(entryFileName)} -d ${normalizePath(
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
      env: {
        ...process.env,
        FORCE_COLOR: "1",
      },
    })`nodemon ${normalizePath(outputFilePath)} -e ts,tsx,js,mjs`,
  ]);
}

export const devCommand = new Command()
  .command("dev")
  .description("Start the development server")
  .argument(
    "<inputPath>",
    "Path to the input file or directory. This will be watched by the builder."
  )
  .option("--output <path>", "Set the output directory", "./dist")
  .option("--execute <filePath>", "File to execute after build", "index.mjs")
  .option("--show-builder-logs", "Show builder logs", false)
  .option("--show-runner-logs", "Show runner logs", true)
  .option(
    "-c, --cwd <path>",
    "Set the current working directory",
    process.cwd()
  )
  .action(devAction);
