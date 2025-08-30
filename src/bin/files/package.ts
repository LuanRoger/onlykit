import { pathExists } from "fs-extra";
import path from "node:path";
import fs from "node:fs/promises";
import { parseJson } from "../utils/json";

export async function updatePackageJson(projectRoot: string) {
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
