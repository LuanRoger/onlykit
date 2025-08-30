import fs from "node:fs/promises";
import path from "node:path";
import ejs from "ejs";
import { fileURLToPath } from "node:url";

export async function createTemplateFile(
  projectName: string,
  srcDir: string,
  template: string
) {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const templatePath = path.resolve(
    __dirname,
    "./templates",
    template,
    "index.ts.ejs"
  );

  const templateSource = await fs.readFile(templatePath, "utf8");
  const rendered = ejs.render(templateSource, {
    projectName,
  });

  await fs.writeFile(path.join(srcDir, "index.ts"), rendered, "utf8");
}
