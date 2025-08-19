import { TsDownProcessMetadata } from "../processes";
import { mountProcessPrefix } from "../utils/log";

// biome-ignore lint/suspicious/noExplicitAny: Any to match the transformer function signature
export function* transformTsDown(line: any) {
  const runnerPrefix = mountProcessPrefix(TsDownProcessMetadata.instance);
  const finalLine = `${runnerPrefix}${line}`;

  console.log(finalLine);
  yield finalLine;
}
