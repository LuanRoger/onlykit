import { NodemonProcessMetadata } from "../processes";
import { mountProcessPrefix } from "../utils/log";

function isNodemonLine(line: string): boolean {
  return line.startsWith("[nodemon]");
}

function removeNodemonPrefix(line: string): string {
  return line.replace("[nodemon] ", "");
}

function clearLine(line: string): string {
  const withoutPrefix = removeNodemonPrefix(line);

  return withoutPrefix;
}

let lineCounter = 0;
// biome-ignore lint/suspicious/noExplicitAny: Any to match the transformer function signature
export function* transformNodemon(line: any) {
  if (lineCounter >= 3) {
    if (!isNodemonLine(line)) {
      yield line;
    }

    const runnerPrefix = mountProcessPrefix(NodemonProcessMetadata.instance);
    const clearedLine = clearLine(line);
    const finalLine = `${runnerPrefix}${clearedLine}`;

    console.log(finalLine);
    yield finalLine;
  } else {
    lineCounter++;
  }
}
