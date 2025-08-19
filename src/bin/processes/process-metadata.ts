import type { ProcessStyle } from "../styles/process-style";

export abstract class ProcessMetadata {
  static readonly instance: ProcessMetadata;

  abstract readonly name: string;
  abstract readonly tag: string;
  abstract readonly style: ProcessStyle;
  abstract readonly version?: string;

  abstract toString(): string;
}
