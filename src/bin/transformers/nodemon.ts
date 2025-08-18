import chalk from "chalk";

const nodemonColor = chalk.green.bold;
const resetStyle = chalk.reset;

function isNodemonLine(line: string): boolean {
  return line.startsWith("[nodemon]");
}

function removeNodemonPrefix(line: string): string {
  return line.replace("[nodemon] ", "");
}

function clearLine(line: string): string {
  const stripAnsiRegex = /\x1B\[[0-?]*[ -/]*[@-~]/g;

  const withoutPrefix = removeNodemonPrefix(line);
  const strippedLine = withoutPrefix.replace(stripAnsiRegex, "");

  return strippedLine;
}

let lineCounter: number = 0;

// biome-ignore lint/suspicious/noExplicitAny: This is a transformer function for nodemon output
export function* transformNodemon(line: any) {
  if (lineCounter >= 3) {
    if (!isNodemonLine(line)) {
      yield line;
    }

    const runnerPrefix = nodemonColor("[runner] ");
    const clearLineContent = clearLine(line);
    const lineContent = resetStyle(clearLineContent);

    const finalLine = `${runnerPrefix}${lineContent}`;
    console.log(finalLine); // Log the transformed line to the console
    yield finalLine;
  } else {
    lineCounter++;
  }
}
