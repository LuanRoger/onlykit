// Generated wrapper to bundle Biome default config as a JS object
const config = {
  $schema: "https://biomejs.dev/schemas/2.2.0/schema.json",
  vcs: {
    enabled: false,
    clientKind: "git",
    useIgnoreFile: false,
  },
  files: {
    ignoreUnknown: false,
  },
  formatter: {
    enabled: true,
    indentStyle: "tab",
  },
  linter: {
    enabled: true,
    rules: {
      recommended: true,
    },
  },
  javascript: {
    formatter: {
      quoteStyle: "double",
    },
  },
  assist: {
    enabled: true,
    actions: {
      source: {
        organizeImports: "on",
      },
    },
  },
} as const;

export default config;
