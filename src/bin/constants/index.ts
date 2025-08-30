export const INIT_TEMPLATES = ["cli", "server"] as const;

export const TS_CONFIG = {
  extends: "onlykit/dev/tsconfig",
  include: ["src/**/*.ts"],
};

export const BIOME_CONFIG = {
  $schema: "https://biomejs.dev/schemas/2.2.2/schema.json",
  extends: ["onlykit/dev/biome"],
};

export const LogSprites = {
  ARROW: "»",
};

export const REGEX = {
  ANSI: /\x1B\[[0-?]*[ -/]*[@-~]/g,
} as const;

export const STANDALONE_ENVIRONMENT_FOLDER = ".onlykit";
