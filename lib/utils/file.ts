import * as path from "node:path";
import { copyFile, mkdir } from "node:fs/promises";
import type { JsonModuleMetadata } from "../types/modules";
import { outRoot, srcRoot } from "../constants";

export async function copyJsonModule(jsonModule: JsonModuleMetadata) {
  const { packageName, moduleName, sourceName } = jsonModule;
  const sourceFile = path.join(srcRoot, packageName, moduleName, sourceName);
  const destinationFile = path.join(
    outRoot,
    packageName,
    moduleName,
    sourceName,
  );
  const destinationDir = path.join(outRoot, packageName, moduleName);

  await mkdir(destinationDir, { recursive: true });
  await copyFile(sourceFile, destinationFile);
}
