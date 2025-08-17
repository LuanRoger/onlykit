import * as fs from "fs";
import * as path from "path";

const pkgPath = path.resolve("node_modules", "hono", "package.json");
const outPath = path.resolve("src", "server", "index.ts");

const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
const exportsField = pkg.exports || {};

const lines = [
  "// AUTO-GENERATED - run scripts/generate-hono-exports.mjs",
  "// DO NOT EDIT MANUALLY",
  'export * from "hono";',
];

for (const key of Object.keys(exportsField)) {
  if (key === ".") continue;
  const sub = key.replace(/^\.\//, "");
  // skip patterns like "./package.json"
  if (sub.endsWith("package.json")) continue;
  lines.push(`export * from "hono/${sub}";`);
}

fs.writeFileSync(outPath, lines.join("\n") + "\n");
console.log("wrote", outPath);
