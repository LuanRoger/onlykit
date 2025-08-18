import chalk from "chalk";
import type { ChildStyle } from "./child-style";

export const NodemonStyle: ChildStyle = {
  tagColor: chalk.green.bold,
} as const;

export const resetStyle = chalk.reset;
