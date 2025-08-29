import { Command } from "commander";
import { $ } from "execa";
import { transformBiome } from "../transformers";
import { normalizePath } from "../utils/path";
import { checkSchema } from "./schemas/check";

// biome-ignore lint/suspicious/noExplicitAny: The type of options is not known at this point, so we use any.
async function checkAction(options: any) {
  const result = checkSchema.parse({
    ...options,
  });

  const { cwd, write } = result;

  try {
    await $({
      stdout: transformBiome,
      stderr: "inherit",
    })`biome check ${write ? "--write" : ""} ${normalizePath(cwd)}`;
  } catch {
    process.exit(1);
  }
}

export const checkCommand = new Command("check")
  .description("Check the project for formatting and linting issues")
  .option("--write", "Automatically fix safe issues", false)
  .option("--cwd <path>", "Current working directory", process.cwd())
  .action(checkAction);
