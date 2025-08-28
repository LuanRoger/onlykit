import z from "zod";

export const devSchema = z.object({
  cwd: z.string(),
  inputPath: z.string(),
  output: z.string(),
  execute: z.string().optional(),
  showBuilderLogs: z.boolean().optional(),
  showRunnerLogs: z.boolean().optional(),
});
