import { NodemonProcessMetadata } from "../processes";
import { resetStyle } from "../styles";
import { clearAnsiLessLine } from "../utils/formater";
import { mountProcessPrefix } from "../utils/log";

function isNodemonLine(line: string): boolean {
  return line.startsWith("[nodemon]");
}

function removeNodemonPrefix(line: string): string {
  return line.replace("[nodemon] ", "");
}

function clearLine(line: string): string {
  const withoutPrefix = removeNodemonPrefix(line);
  const strippedLine = clearAnsiLessLine(withoutPrefix);

  return strippedLine;
}

let lineCounter = 0;
// biome-ignore lint/suspicious/noExplicitAny: Any to match the transformer function signature
export function* transformNodemon(line: any) {
  if (lineCounter >= 3) {
    if (!isNodemonLine(line)) {
      yield line;
    }

    const runnerPrefix = mountProcessPrefix(NodemonProcessMetadata.instance);
    const clearLineContent = clearLine(line);
    const lineContent = resetStyle(clearLineContent);
    const finalLine = `${runnerPrefix}${lineContent}`;

    console.log(finalLine);
    yield finalLine;
  } else {
    lineCounter++;
  }
}
