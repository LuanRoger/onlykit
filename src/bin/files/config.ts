import fs from "node:fs/promises";
import path from "node:path";
import { BIOME_CONFIG, TS_CONFIG } from "../constants";
import { parseJson } from "../utils/json";

export async function createTsConfig(projectRoot: string) {
  await fs.writeFile(
    path.join(projectRoot, "tsconfig.json"),
    parseJson(TS_CONFIG),
    "utf8",
  );
}

export async function createBiomeConfig(projectRoot: string) {
  await fs.writeFile(
    path.join(projectRoot, "biome.json"),
    parseJson(BIOME_CONFIG),
    "utf8",
  );
}
