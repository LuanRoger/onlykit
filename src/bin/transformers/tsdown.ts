import { TsDownProcessMetadata } from "../processes";
import { mountProcessPrefix } from "../utils/log";

let lineCounter = 0;
// biome-ignore lint/suspicious/noExplicitAny: Any to match the transformer function signature
export function* transformTsDown(line: any) {
  if (lineCounter >= 1) {
    const runnerPrefix = mountProcessPrefix(TsDownProcessMetadata.instance);
    const finalLine = `${runnerPrefix}${line}`;

    console.log(finalLine);
    yield finalLine;
  } else {
    lineCounter++;
  }
}
