import type { UserConfig } from "tsdown";
import { wasmSupport } from "@/wasm";

export const tsdownConfig: UserConfig = {
  plugins: [wasmSupport()],
};
