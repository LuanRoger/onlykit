import { $ } from "execa";
import { transformTsDown } from "../../transformers";
import { normalizePath } from "../../utils/path";
import { ExecutorCommand } from "./executor";

interface TsDownExecutorOptions {
  inputPath: string;
}

export interface TsDownBuildOptions extends TsDownExecutorOptions {
  outputPath: string;
  watch?: boolean;
}

export class TsDownBuildExecutor extends ExecutorCommand<TsDownBuildOptions> {
  outTransformer: (line: unknown) => Generator<string, void, unknown>;

  constructor(
    options: TsDownBuildOptions,
    ignoreOut: boolean = false,
    exitOnError: boolean = false
  ) {
    super(options, ignoreOut, exitOnError);
    this.outTransformer = transformTsDown;
  }

  mountArgs(): string[] {
    const { inputPath, outputPath, watch = false } = this.options;

    return [
      ...(watch ? ["--watch"] : []),
      normalizePath(inputPath),
      "-d",
      normalizePath(outputPath),
    ];
  }

  async execute() {
    const args = this.mountArgs();

    try {
      void (await $({
        stdout: this.ignoreOut ? "ignore" : this.outTransformer,
        stderr: "inherit",
      })`tsdown ${args}`);
    } catch {
      if (!this.exitOnError) {
        return;
      }
      process.exit(1);
    }
  }
}
