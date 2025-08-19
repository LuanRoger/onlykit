import chalk from "chalk";
import { mountProcessPrefix } from "../utils/log";
import type { ProcessMetadata } from "./process-metadata";

export class TsDownProcessMetadata implements ProcessMetadata {
  static readonly instance = new TsDownProcessMetadata();

  readonly name = "tsdown";
  readonly tag = "builder";
  readonly style = {
    tagColor: chalk.yellowBright.bold,
  };

  toString(): string {
    return mountProcessPrefix(this);
  }
}
