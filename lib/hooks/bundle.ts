import { JsonModuleMetadata } from "../types/modules";
import { copyJsonModule } from "../utils/file";

export const jsonModules: JsonModuleMetadata[] = [
  {
    packageName: "dev",
    moduleName: "biome",
    sourceName: "biome.json",
  },
  {
    packageName: "dev",
    moduleName: "ts-config",
    sourceName: "base.json",
  },
];

export function copyJson() {
  return {
    name: "copy-json",
    async writeBundle() {
      const copyPromises = jsonModules.map(copyJsonModule);
      await Promise.all(copyPromises);
    },
  };
}
