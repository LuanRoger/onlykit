import type { ValueOf } from "type-fest";

export const LogSprites = {
  ARROW: " » ",
};

export const NodemonProcess = {
  NAME: "nodemon",
  TAG: "runner",
} as const;

export type NodemonProcess = ValueOf<typeof NodemonProcess>;

export const REGEX = {
  ANSI: /\x1B\[[0-?]*[ -/]*[@-~]/g,
} as const;
