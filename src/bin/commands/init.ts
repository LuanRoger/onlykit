import { Command } from "commander";
import { initSchema } from "./schemas";
import ora from "ora";
import path from "node:path";
import fs from "node:fs/promises";
import ejs from "ejs";
import { fileURLToPath } from "node:url";
import { BIOME_CONFIG, TS_CONFIG } from "../constants";
import { parseJson } from "../utils/json";
import { pathExists } from "fs-extra";

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

async function updatePackageJson(
  projectRoot: string,
) {
  const packageJsonPath = path.join(projectRoot, "package.json");
  const doesPackageJsonExist = await pathExists(packageJsonPath);

  if (!doesPackageJsonExist) {
    console.warn("package.json does not exist, creating a new one.");
  }

  const existingPackageJsonContent = await fs.readFile(packageJsonPath, "utf8");
  const existingPackageJson = JSON.parse(existingPackageJsonContent);

  const newScripts = {
    start: "node dist/index.mjs",
    dev: "onlykit dev ./src",
    build: "onlykit build ./src/index.ts",
    check: "onlykit check",
    "check:write": "onlykit check --write",
  };
  existingPackageJson.scripts = {
    ...existingPackageJson.scripts,
    ...newScripts,
  };

  await fs.writeFile(
    path.join(projectRoot, "package.json"),
    parseJson(existingPackageJson),
    "utf8"
  );
}

async function createTsConfig(projectRoot: string) {
  await fs.writeFile(
    path.join(projectRoot, "tsconfig.json"),
    parseJson(TS_CONFIG),
    "utf8"
  );
}

async function createBiomeConfig(projectRoot: string) {
  await fs.writeFile(
    path.join(projectRoot, "biome.json"),
    parseJson(BIOME_CONFIG),
    "utf8"
  );
}

async function createTemplateFile(
  projectName: string,
  srcDir: string,
  template: string
) {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const templatePath = path.resolve(
    __dirname,
    "./templates",
    template,
    "index.ts.ejs"
  );

  const templateSource = await fs.readFile(templatePath, "utf8");
  const rendered = ejs.render(templateSource, {
    projectName,
  });

  await fs.writeFile(path.join(srcDir, "index.ts"), rendered, "utf8");
}

export const initCommand = new Command()
  .command("init")
  .description("Initialize a new OnlyKit project")
  .argument("<projectName>", "Name of the new project")
  .option("--template <template>", 'Template to use. ["cli", "server"]', "cli")
  .option(
    "-c, --cwd <path>",
    "Set the current working directory",
    process.cwd()
  )
  .action(initAction);
