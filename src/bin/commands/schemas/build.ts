import z from "zod";

export const buildSchema = z.object({
  cwd: z.string(),
  inputPath: z.string().optional(),
  config: z.string(),
  output: z.string(),
});
