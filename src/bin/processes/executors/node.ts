import { $ } from "execa";
import { transformGeneric } from "../../transformers";
import { ExecutorCommand } from "./executor";

interface NodeExecuteOptions {
  inputPath: string;
}

export class NodeExecuteExecutor extends ExecutorCommand<NodeExecuteOptions> {
  outTransformer: (line: unknown) => Generator<string, void, unknown>;

  constructor(
    options: NodeExecuteOptions,
    ignoreOut: boolean = false,
    exitOnError: boolean = false,
  ) {
    super(options, ignoreOut, exitOnError);
    this.outTransformer = transformGeneric;
  }

  mountArgs(): string[] {
    const { inputPath } = this.options;

    return [inputPath];
  }

  async execute(): Promise<void> {
    const args = this.mountArgs();

    try {
      void (await $({
        stdout: this.ignoreOut ? "ignore" : "inherit",
        stderr: "inherit",
      })`node ${args}`);
    } catch {
      if (!this.exitOnError) {
        return;
      }
      process.exit(1);
    }
  }
}
