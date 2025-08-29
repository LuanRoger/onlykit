import chalk, * as chalkInternals from "chalk";
import * as commander from "commander";
import * as execa from "execa";
import figlet from "figlet";
import * as ora from "ora";

export { chalk, chalkInternals, figlet, ora, execa, commander };
export type Figlet = typeof figlet;
