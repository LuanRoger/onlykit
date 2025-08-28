export const INIT_TEMPLATES = ["cli", "server"] as const;

export const TS_CONFIG = {
  extends: "onlykit/dist/dev/tsconfig/base.json",
  include: ["src/**/*.ts"],
};

export const LogSprites = {
  ARROW: "»",
};

export const REGEX = {
  ANSI: /\x1B\[[0-?]*[ -/]*[@-~]/g,
} as const;
