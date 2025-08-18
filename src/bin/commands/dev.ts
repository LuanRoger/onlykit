import { $ } from "execa";
import { z } from "zod";
import { Command } from "commander";
import path from "node:path";
import { normalizePath } from "../utils/path";
import { transformNodemon } from "../transformers";

const devSchema = z.object({
  cwd: z.string(),
  inputPath: z.string(),
  output: z.string(),
  showBuilderLogs: z.boolean().optional(),
  showRunnerLogs: z.boolean().optional(),
});

export const devCommand = new Command()
  .command("dev")
  .description("Start the development server")
  .argument(
    "<inputPath>",
    "Path to the input file or directory. This will be watched by the builder."
  )
  .option("--output <path>", "Set the output entrypoint", "./dist/index.mjs")
  .option("--show-builder-logs", "Show builder logs", false)
  .option("--show-runner-logs", "Show runner logs", true)
  .option(
    "-c, --cwd <path>",
    "Set the current working directory",
    process.cwd()
  )
  .action(async (inputPath, options) => {
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

    const { failed } = await $({
      preferLocal: true,
      stdio: showBuilderLogs ? "inherit" : "ignore",
    })`tsdown ${normalizePath(inputPathResolved)}`;
    if (failed) {
      process.exit(1);
    }

    await Promise.all([
      $({
        stdio: showBuilderLogs ? "inherit" : "ignore",
      })`tsdown --watch ${normalizePath(inputPathResolved)}`,
      $({
        stdout: showRunnerLogs ? transformNodemon : "ignore",
      })`nodemon ${normalizePath(outputPathResolved)}`,
    ]);
  });
