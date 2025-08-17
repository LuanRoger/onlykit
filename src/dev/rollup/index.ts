import typescript from "@rollup/plugin-typescript";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

export default {
  output: {
    dir: "dist",
    format: "cjs",
    sourcemap: true,
    exports: "auto",
  },
  treeshake: {
    moduleSideEffects: false,
    propertyReadSideEffects: false,
  },
  plugins: [
    resolve({
      preferBuiltins: true,
      browser: false,
    }),

    commonjs({
      include: /node_modules/,
    }),

    typescript({
      tsconfig: "./tsconfig.json",
      sourceMap: true,
      inlineSources: true,
    }),
  ],
};
