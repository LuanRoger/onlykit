import z from "zod";
import { INIT_TEMPLATES } from "../../constants";

export const initSchema = z.object({
  cwd: z.string(),
  projectName: z.string(),
  template: z.enum(INIT_TEMPLATES).optional(),
});
