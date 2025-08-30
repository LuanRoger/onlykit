import fs from "node:fs/promises";
import path from "node:path";
import { Command } from "commander";
import ora from "ora";
import {
  createBiomeConfig,
  createTemplateFile,
  createTsConfig,
  updatePackageJson,
} from "../files";
import { initSchema } from "./schemas";

// biome-ignore lint/suspicious/noExplicitAny: The type of options is not known at this point, so we use any.
async function initAction(projectName: string, options: any) {
  const result = initSchema.parse({
    projectName,
    ...options,
  });

  const { projectName: parsedProjectName, template = "cli", cwd } = result;

  const spinner = ora("Initializing project...").start();

  try {
    const projectRoot = path.resolve(cwd, parsedProjectName);
    const srcDir = path.join(projectRoot, "src");

    await fs.mkdir(srcDir, { recursive: true });

    spinner.text = "Creating package.json and tsconfig.json...";
    await Promise.all([
      await updatePackageJson(projectRoot),
      await createTsConfig(projectRoot),
      await createBiomeConfig(projectRoot),
    ]);

    spinner.text = "Creating template files...";
    await createTemplateFile(parsedProjectName, srcDir, template);

    spinner.succeed("Project initialized");
  } catch (err) {
    spinner.fail("Failed to initialize project");
    console.error(err);
    process.exit(1);
  }
}

export const initCommand = new Command()
  .command("init")
  .description("Initialize a new OnlyKit project")
  .argument("<projectName>", "Name of the new project")
  .option("--template <template>", 'Template to use. ["cli", "server"]', "cli")
  .option(
    "-c, --cwd <path>",
    "Set the current working directory",
    process.cwd(),
  )
  .action(initAction);
