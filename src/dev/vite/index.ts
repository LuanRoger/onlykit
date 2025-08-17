import { defineConfig } from "vite";
import path from "node:path";

export default defineConfig({
  root: process.cwd(),
  resolve: {
    alias: {
      "@": path.resolve(process.cwd(), "src"),
    },
  },
  // Reasonable modern defaults; adjust to your targets
  build: {
    target: "es2022",
    sourcemap: true,
  },
  // Small nudge for dep optimization in dev
  optimizeDeps: {
    include: ["ky"],
  },
  server: {
    port: 5173,
    strictPort: false,
  },
  preview: {
    port: 4173,
  },
  // Add your preferred plugins here, or expose a factory that toggles them
});
