import { Command } from "commander";
import { BiomeCheckExecutor } from "../processes/executors";
import { checkSchema } from "./schemas/check";

// biome-ignore lint/suspicious/noExplicitAny: The type of options is not known at this point, so we use any.
async function checkAction(options: any) {
  const result = checkSchema.parse({
    ...options,
  });

  const { cwd, write } = result;
  const biomeExecutor = new BiomeCheckExecutor(
    {
      cwd,
      write,
    },
    false,
    true,
  );

  await biomeExecutor.execute();
}

export const checkCommand = new Command("check")
  .description("Check the project for formatting and linting issues")
  .option("--write", "Automatically fix safe issues", false)
  .option("--cwd <path>", "Current working directory", process.cwd())
  .action(checkAction);
