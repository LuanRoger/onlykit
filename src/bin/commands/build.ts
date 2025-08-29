import path from "node:path";
import { Command } from "commander";
import { $ } from "execa";
import { transformTsDown } from "../transformers";
import { normalizePath } from "../utils/path";
import { buildSchema } from "./schemas";

// biome-ignore lint/suspicious/noExplicitAny: The type of options is not known at this point, so we use any.
async function buildAction(inputPath: string, options: any) {
  const result = buildSchema.parse({
    inputPath,
    ...options,
  });

  const { cwd, inputPath: parsedInputPath, output } = result;

  const resolvedCwd = path.resolve(cwd);
  const inputPathResolved = path.resolve(resolvedCwd, parsedInputPath);
  const outputPathResolved = path.resolve(resolvedCwd, output);

  try {
    await $({
      stdout: transformTsDown,
      stderr: "inherit",
    })`tsdown ${normalizePath(inputPathResolved)} --d ${normalizePath(
      outputPathResolved,
    )}`;
  } catch {
    process.exit(1);
  }
}

export const buildCommand = new Command()
  .command("build")
  .description("Build the project for production")
  .argument("<inputPath>", "Path to the input file or directory.")
  .option("--output <path>", "Set the output entrypoint", "./dist")
  .option("--show-builder-logs", "Show builder logs", false)
  .option(
    "-c, --cwd <path>",
    "Set the current working directory",
    process.cwd(),
  )
  .action(buildAction);
