import { $ } from "execa";
import { transformBiome } from "../../transformers";
import { normalizePath } from "../../utils/path";
import { ExecutorCommand } from "./executor";

interface BiomeExecutorOptions {
  cwd: string;
}

export interface BiomeCheckOptions extends BiomeExecutorOptions {
  write: boolean;
}

export class BiomeCheckExecutor extends ExecutorCommand<BiomeCheckOptions> {
  outTransformer: (line: unknown) => Generator<string, void, unknown>;

  constructor(
    options: BiomeCheckOptions,
    ignoreOut: boolean = false,
    exitOnError: boolean = false
  ) {
    super(options, ignoreOut, exitOnError);
    this.outTransformer = transformBiome;
  }

  mountArgs(): string[] {
    const { cwd, write } = this.options;

    return [normalizePath(cwd), ...(write ? ["--write"] : [])];
  }

  async execute() {
    const args = this.mountArgs();

    try {
      void (await $({
        stdout: this.ignoreOut ? "ignore" : this.outTransformer,
        stderr: "inherit",
      })`biome ${args}`);
    } catch {
      if (!this.exitOnError) {
        return;
      }
      process.exit(1);
    }
  }
}
