import { NodemonProcess } from "../constants";
import { NodemonStyle, resetStyle } from "../styles";
import { clearAnsiLessLine } from "../utils/formater";
import { mountPrefix } from "../utils/log";

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
// biome-ignore lint/suspicious/noExplicitAny: This is a transformer function for nodemon output
export function* transformNodemon(line: any) {
  if (lineCounter >= 3) {
    if (!isNodemonLine(line)) {
      yield line;
    }

    const runnerPrefix = mountPrefix(NodemonProcess.TAG, NodemonStyle);
    const clearLineContent = clearLine(line);
    const lineContent = resetStyle(clearLineContent);
    const finalLine = `${runnerPrefix}${lineContent}`;

    console.log(finalLine);
    yield finalLine;
  } else {
    lineCounter++;
  }
}
