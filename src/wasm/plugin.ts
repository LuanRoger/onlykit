import asc from "assemblyscript/asc";
import { readFile, writeFileSync, readFileSync, unlinkSync } from "node:fs";
import path from "node:path";
import {
  D_TS_EXTENSION,
  JS_EXTENSION,
  TS_EXTENSION,
  TS_TEMP_EXTENSION,
  WASM_DIRECTIVE_REGEX,
  WASM_EXTENSION,
  WASM_TEXT_EXTENSION,
} from "./constants";
import { StandaloneEnvironment } from "@/bin/standalone";

interface AssemblyScriptOptions {
  optimize?: boolean;
  runtime?: "incremental" | "minimal" | "stub";
  exportRuntime?: boolean;
  importMemory?: boolean;
  initialMemory?: number;
  maximumMemory?: number;
  sharedMemory?: boolean;
  debug?: boolean;
}

function getCompilerFlags(options: AssemblyScriptOptions): string[] {
  const flags: string[] = [];

  if (options.optimize) {
    flags.push("--optimize");
  }

  if (options.runtime) {
    flags.push("--runtime", options.runtime);
  }

  if (options.importMemory) {
    flags.push("--importMemory");
  }

  if (options.initialMemory) {
    flags.push("--initialMemory", options.initialMemory.toString());
  }

  if (options.maximumMemory) {
    flags.push("--maximumMemory", options.maximumMemory.toString());
  }

  if (options.sharedMemory) {
    flags.push("--sharedMemory");
  }

  if (options.debug) {
    flags.push("--debug");
  }

  return flags;
}

export default function webAssemblySupport(
  options: AssemblyScriptOptions = {}
) {
  return {
    name: "wasm-support",

    async load(id: string) {
      const isTsFile = id.endsWith(".ts");
      if (!isTsFile) return null;

      try {
        const code = readFileSync(id, "utf-8");
        const hasWasmDirective = WASM_DIRECTIVE_REGEX.test(code.trim());
        if (!hasWasmDirective) {
          return null;
        }

        return code;
      } catch {
        return null;
      }
    },

    async transform(code: string, id: string) {
      const hasWasmDirective = WASM_DIRECTIVE_REGEX.test(code.trim());
      if (!hasWasmDirective) {
        return null;
      }

      const cleanCode = code.replace(WASM_DIRECTIVE_REGEX, "");
      const fileName = path.basename(id);
      const cwd = process.cwd();
      const tempCodeFileName = fileName.replace(
        TS_EXTENSION,
        TS_TEMP_EXTENSION
      );
      const wasmFileName = fileName.replace(TS_EXTENSION, WASM_EXTENSION);
      const wasmTextFileName = fileName.replace(
        TS_EXTENSION,
        WASM_TEXT_EXTENSION
      );
      const jsBindingsFileName = fileName.replace(TS_EXTENSION, JS_EXTENSION);

      const standaloneEnvironment = new StandaloneEnvironment(cwd);
      const outFilePath = path.join(
        standaloneEnvironment.standaloneOutputPath,
        wasmFileName
      );
      const textFilePath = path.join(
        standaloneEnvironment.standaloneOutputPath,
        wasmTextFileName
      );
      const jsBindingsPath = path.join(
        standaloneEnvironment.standaloneOutputPath,
        jsBindingsFileName
      );

      writeFileSync(tempCodeFileName, cleanCode);

      const compilerOptions = [
        tempCodeFileName,
        "--outFile",
        outFilePath,
        "--textFile",
        textFilePath,
        "--bindings",
        "esm",
        "--exportRuntime",
        ...getCompilerFlags(options),
      ];

      try {
        const { error, stderr } = await asc.main(compilerOptions, {
          stdout: process.stdout,
          stderr: process.stderr,
        });

        if (error) {
          throw new Error(`AssemblyScript compilation failed: ${stderr}`);
        }

        const generatedBindings = readFileSync(jsBindingsPath, "utf-8");

        return {
          code: generatedBindings,
          map: null,
        };
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(
            `AssemblyScript compilation failed: ${error.message}`
          );
        }
      }
    },
  };
}
