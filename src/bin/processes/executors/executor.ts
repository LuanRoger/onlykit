export abstract class ExecutorCommand<T> {
  protected abstract readonly outTransformer: (
    line: unknown
  ) => Generator<string, void, unknown>;

  protected readonly ignoreOut: boolean;
  protected readonly exitOnError: boolean;
  protected readonly options: T;

  constructor(
    options: T,
    ignoreOut: boolean = false,
    exitOnError: boolean = false
  ) {
    this.options = options;
    this.ignoreOut = ignoreOut;
    this.exitOnError = exitOnError;
  }

  abstract execute(): Promise<void>;
  abstract mountArgs(): string[];
}
