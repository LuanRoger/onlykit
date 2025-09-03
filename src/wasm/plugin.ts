/** biome-ignore-all lint/suspicious/noExplicitAny: tsdown has no exported type for plugin */

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import asc from "assemblyscript/asc";
import { readJson } from "fs-extra";
import { StandaloneEnvironment } from "@/bin/standalone";
import {
  BINDINGS_DEFAULT_WASM_URL_REGEX,
  D_TS_EXTENSION,
  JS_EXTENSION,
  TS_EXTENSION,
  WASM_DIRECTIVE_REGEX,
  WASM_EXTENSION,
  WASM_MAP_EXTENSION,
  WASM_TEXT_EXTENSION,
} from "./constants";
import { createHash } from "node:crypto";

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
      const isTsFile = id.endsWith(TS_EXTENSION);
      if (!isTsFile) return null;

      try {
        const code = await readFile(id, "utf-8");
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
      const wasmFileName = fileName.replace(TS_EXTENSION, WASM_EXTENSION);
      const wasmTextFileName = fileName.replace(
        TS_EXTENSION,
        WASM_TEXT_EXTENSION
      );
      const jsBindingsFileName = fileName.replace(TS_EXTENSION, JS_EXTENSION);
      const dTsFileName = fileName.replace(TS_EXTENSION, D_TS_EXTENSION);
      const sourceMapFileName = fileName.replace(
        TS_EXTENSION,
        WASM_MAP_EXTENSION
      );

      const standaloneEnvironment = new StandaloneEnvironment(cwd);
      const tempCodeFileName = path.join(
        standaloneEnvironment.standaloneOutputPath,
        fileName
      );
      await standaloneEnvironment.setup();
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
      const dTsPath = path.join(
        standaloneEnvironment.standaloneOutputPath,
        dTsFileName
      );
      const sourceMapPath = path.join(
        standaloneEnvironment.standaloneOutputPath,
        sourceMapFileName
      );

      await writeFile(tempCodeFileName, cleanCode);

      const compilerOptions = [
        tempCodeFileName,
        "--outFile",
        outFilePath,
        "--textFile",
        textFilePath,
        "--sourceMap",
        sourceMapPath,
        "--bindings",
        "esm",
        "--optimize",
        "--optimizeLevel",
        "3",
        "--shrinkLevel",
        "0",
        "--noAssert",
        "--converge",
        "--exportRuntime",
        ...getCompilerFlags(options),
      ];

      try {
        const { error } = await asc.main(compilerOptions, {
          stdout: process.stdout,
          stderr: process.stderr,
        });

        if (error) {
          throw new Error(
            `AssemblyScript compilation failed: ${error.message}`
          );
        }

        const [
          wasmBinaryContent,
          wasmTextContent,
          generatedBindings,
          dTsContent,
          sourceMap,
        ] = await Promise.all([
          readFile(outFilePath),
          readFile(textFilePath, "utf-8"),
          readFile(jsBindingsPath, "utf-8"),
          readFile(dTsPath, "utf-8"),
          readJson(sourceMapPath, "utf-8"),
        ]);

        const idUniqueHash = createHash("sha1")
          .update(id)
          .digest("hex")
          .slice(0, 8);
        const wasmDistPath = path.join(
          "wasm",
          `${idUniqueHash}-${wasmFileName}`
        );
        const wasmTextDistPath = path.join(
          "wasm",
          `${idUniqueHash}-${wasmTextFileName}`
        );
        const dTsDistPath = path.join("wasm", `${idUniqueHash}-${dTsFileName}`);

        const referenceId = (this as any).emitFile({
          type: "asset",
          fileName: wasmDistPath,
          source: wasmBinaryContent,
        });
        (this as any).emitFile({
          type: "asset",
          fileName: wasmTextDistPath,
          source: wasmTextContent,
        });
        (this as any).emitFile({
          type: "asset",
          fileName: dTsDistPath,
          source: dTsContent,
        });

        await standaloneEnvironment.clean();

        const resolvedBindings = generatedBindings.replace(
          BINDINGS_DEFAULT_WASM_URL_REGEX,
          `new URL(import.meta.ROLLUP_FILE_URL_${referenceId})`
        );
        return {
          code: resolvedBindings,
          map: sourceMap,
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
