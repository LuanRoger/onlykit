// biome-ignore lint/suspicious/noExplicitAny: Any to match the transformer function signature
export function* transformGeneric(line: any) {
  yield line;
}
