export function parseJson(input: unknown): string {
  return `${JSON.stringify(input, null, 2)}\n`;
}
