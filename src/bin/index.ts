#!/usr/bin/env node

import { Command } from "commander";
import packageJson from "~/package.json";
import { devCommand as dev } from "./commands/dev";
import { buildCommand as build } from "./commands/build";
import { initCommand as init } from "./commands/init";
import { checkCommand as check } from "./commands/check";

async function main() {
  const program = new Command()
    .name("onlykit")
    .description("The only thing you need...")
    .version(packageJson.version, "-v, --version", "show the current version");

  program.addCommand(dev);
  program.addCommand(build);
  program.addCommand(init);
  program.addCommand(check);

  program.parse();
}

main();
