import asc from "assemblyscript/asc";
import { readFileSync, writeFileSync, unlinkSync } from "node:fs";

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

    load(id: string) {
      if (!id.endsWith(".ts")) return null;

      try {
        const code = readFileSync(id, "utf-8");

        // Check for "use wasm" directive
        if (
          !code.trim().startsWith('"use wasm"') &&
          !code.trim().startsWith("'use wasm'")
        ) {
          return null;
        }

        return code;
      } catch {
        return null;
      }
    },

    async transform(code: string, id: string) {
      if (
        !code.trim().startsWith('"use wasm"') &&
        !code.trim().startsWith("'use wasm'")
      ) {
        return null;
      }

      // Remove the "use wasm" directive for AssemblyScript compilation
      const cleanCode = code.replace(/^["']use wasm["'];?\s*/, "");

      // Write temporary file for AssemblyScript compiler
      const tempFile = id.replace(".ts", ".temp.ts");
      writeFileSync(tempFile, cleanCode);

      // Compile with AssemblyScript and generate bindings
      const wasmFile = id.replace(".ts", ".wasm");
      const jsBindingsFile = id.replace(".ts", ".js");

      const compilerOptions = [
        tempFile,
        "--outFile",
        wasmFile,
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

        // Read the generated JavaScript bindings
        const generatedBindings = readFileSync(jsBindingsFile, "utf-8");

        // Also emit the WASM file as an asset so it's included in the bundle
        const wasmBuffer = readFileSync(wasmFile);
        const wasmFileName = wasmFile.split(/[/\\]/).pop() || "module.wasm"; // Get just the filename

        (this as any).emitFile({
          type: "asset",
          fileName: wasmFileName,
          source: wasmBuffer,
        });

        // Clean up temp files and generated files in source directory
        const dtsFile = id.replace(".ts", ".d.ts");
        try {
          unlinkSync(tempFile);
          unlinkSync(jsBindingsFile);
          unlinkSync(wasmFile);
          unlinkSync(dtsFile); // Also clean up the .d.ts file
        } catch {}

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
