import { NodemonProcessMetadata } from "../processes";
import { clearAnsiLessLine } from "../utils/formater";
import { mountProcessPrefix } from "../utils/log";

function isNodemonLine(line: string): boolean {
  if (typeof line !== "string") {
    return false;
  }

  const trimmedLine = line.trim();
  const clearedLine = clearAnsiLessLine(trimmedLine);
  const prefix = clearedLine.slice(0, 9);
  return prefix === "[nodemon]";
}

function removeNodemonPrefix(line: string): string {
  return line.replace("[nodemon] ", "");
}

function clearLine(line: string): string {
  const withoutPrefix = removeNodemonPrefix(line);
  const clearedLine = clearAnsiLessLine(withoutPrefix);

  return clearedLine;
}

let lineCounter = 0;
// biome-ignore lint/suspicious/noExplicitAny: Any to match the transformer function signature
export function* transformNodemon(line: any) {
  if (lineCounter >= 3) {
    const runnerPrefix = mountProcessPrefix(NodemonProcessMetadata.instance);
    const clearedLine = isNodemonLine(line) ? clearLine(line) : line;
    const finalLine = `${runnerPrefix}${clearedLine}`;

    console.log(finalLine);
    yield finalLine;
  } else {
    lineCounter++;
  }
}
