import z from "zod";

export const checkSchema = z.object({
  cwd: z.string(),
  write: z.boolean(),
});
