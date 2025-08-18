import { LogSprites } from "../constants";
import type { ChildStyle } from "../styles/child-style";

export function mountPrefix(tag: string, style: ChildStyle): string {
  const styledTag = style.tagColor(tag);
  const formating = `[${styledTag}]${LogSprites.ARROW}`;

  return formating;
}
