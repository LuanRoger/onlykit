import chalk from "chalk";
import { mountProcessPrefix } from "../utils/log";
import type { ProcessMetadata } from "./process-metadata";

export class NodemonProcessMetadata implements ProcessMetadata {
  static readonly instance = new NodemonProcessMetadata();

  readonly name = "nodemon";
  readonly tag = "runner";
  readonly style = {
    tagColor: chalk.green.bold,
  };

  toString(): string {
    return mountProcessPrefix(this);
  }
}
