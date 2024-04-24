import { randomColor } from "./randomColor";

const colorMapArray: { name: string; color: string }[] = [];

export function getColor(text: string): string {
  const existingColorMap = colorMapArray.find((n) => n.name === text);
  if (!existingColorMap) {
    const color = randomColor();
    colorMapArray.push({ name: text, color });
    return color;
  }
  return existingColorMap.color;
}
