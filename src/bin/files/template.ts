import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ejs from "ejs";

type TemplateKind = "cli" | "server" | "config";

export async function createTemplateFile(
  targetPath: string,
  templatePath: string,
  kind: TemplateKind,
) {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const templatePathResolved = path.resolve(
    __dirname,
    "./templates",
    kind,
    templatePath,
  );

  const templateSource = await fs.readFile(templatePathResolved, "utf8");
  const rendered = ejs.render(templateSource);

  await fs.writeFile(targetPath, rendered, "utf8");
}
