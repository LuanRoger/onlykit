import { LogSprites } from "../constants";
import type { ProcessMetadata } from "../processes/process-metadata";
import { processNameStyle } from "../styles";

export function mountProcessPrefix(process: ProcessMetadata): string {
  const { name, tag, style } = process;

  const styledTag = style.tagColor(tag);
  const styledName = processNameStyle(name);
  const formating = `[${styledTag} (${styledName})] ${LogSprites.ARROW} `;

  return formating;
}
