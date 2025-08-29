#!/usr/bin/env node

import { Command } from "commander";
import packageJson from "~/package.json";
import { buildCommand as build } from "./commands/build";
import { checkCommand as check } from "./commands/check";
import { devCommand as dev } from "./commands/dev";
import { initCommand as init } from "./commands/init";

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
