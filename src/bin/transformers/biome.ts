import { BiomeProcessMetadata } from "../processes/biome";
import { mountProcessPrefix } from "../utils/log";

// biome-ignore lint/suspicious/noExplicitAny: Any to match the transformer function signature
export function* transformBiome(line: any) {
  const runnerPrefix = mountProcessPrefix(BiomeProcessMetadata.instance);
  const finalLine = `${runnerPrefix}${line}`;

  console.log(finalLine);
  yield finalLine;
}
