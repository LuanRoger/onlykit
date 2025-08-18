import { REGEX } from "../constants";

export function clearAnsiLessLine(line: string): string {
  const stripAnsiRegex = REGEX.ANSI;
  const strippedLine = line.replace(stripAnsiRegex, "");

  return strippedLine;
}
