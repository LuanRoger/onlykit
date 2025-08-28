import chalk from "chalk";
import * as chalkInternals from "chalk";
import figlet from "figlet";
import * as ora from "ora";
import * as execa from "execa";
import * as commander from "commander";

export { chalk, chalkInternals, figlet, ora, execa, commander };
export type Figlet = typeof figlet;
