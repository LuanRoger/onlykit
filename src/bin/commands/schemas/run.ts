import z from "zod";

export const runSchema = z.object({
  cwd: z.string(),
  entryPoint: z.string(),
  watch: z.boolean(),
  noTsconfig: z.boolean(),
});
