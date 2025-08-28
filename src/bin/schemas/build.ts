import z from "zod";

export const buildSchema = z.object({
  cwd: z.string(),
  inputPath: z.string(),
  output: z.string(),
});
