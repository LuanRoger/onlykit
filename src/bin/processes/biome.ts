import chalk from "chalk";
import { mountProcessPrefix } from "../utils/log";
import type { ProcessMetadata } from "./process-metadata";

export class BiomeProcessMetadata implements ProcessMetadata {
  static readonly instance = new BiomeProcessMetadata();

  readonly name = "biome";
  readonly tag = "formatting";
  readonly style = {
    tagColor: chalk.blueBright.bold,
  };

  toString(): string {
    return mountProcessPrefix(this);
  }
}
