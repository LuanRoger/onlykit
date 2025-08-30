import z from "zod";

export const runSchema = z.object({
  cwd: z.string(),
  entryPoint: z.string(),
  tsconfig: z.boolean(),
});
