export function parseJson(input: any): any {
  return JSON.stringify(input, null, 2) + "\n";
}
