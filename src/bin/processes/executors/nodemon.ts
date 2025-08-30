import { $ } from "execa";
import { transformNodemon } from "../../transformers";
import { ExecutorCommand } from "./executor";

interface NodemonExecutorOptions {
  inputPath: string;
}

export interface NodemonExecuteOptions extends NodemonExecutorOptions {
  watchPath?: string;
}

export class NodemonExecuteExecutor extends ExecutorCommand<NodemonExecuteOptions> {
  outTransformer: (line: unknown) => Generator<string, void, unknown>;

  constructor(
    options: NodemonExecuteOptions,
    ignoreOut: boolean = false,
    exitOnError: boolean = false,
  ) {
    super(options, ignoreOut, exitOnError);
    this.outTransformer = transformNodemon;
  }

  mountArgs(): string[] {
    const { inputPath, watchPath } = this.options;

    return [
      "--exec",
      `"node ${inputPath}"`,
      ...(watchPath ? ["--watch", watchPath] : []),
      "-e",
      "ts,tsx,js,mjs",
      "--ignore",
      "node_modules",
    ];
  }

  async execute(): Promise<void> {
    const args = this.mountArgs();

    try {
      void (await $({
        stdout: this.ignoreOut ? "ignore" : this.outTransformer,
        stderr: "inherit",
        env: {
          ...process.env,
          FORCE_COLOR: "1",
        },
      })`nodemon ${args}`);
    } catch {
      if (!this.exitOnError) {
        return;
      }
      process.exit(1);
    }
  }
}
