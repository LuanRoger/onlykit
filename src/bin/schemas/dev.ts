import z from "zod";

export const devSchema = z.object({
  cwd: z.string(),
  inputPath: z.string(),
  output: z.string(),
  showBuilderLogs: z.boolean().optional(),
  showRunnerLogs: z.boolean().optional(),
});
