/**
 * Check if hex color is light or dark
 * @param color (Hex formatted)
 */
export function lightOrDark(color: string): string {
  // Convert hex to RGB: http://gist.github.com/983661
  const newColor = parseInt(`0x${color.slice(1).replace(/./g, "$&$&")}`);

  const r = newColor >> 16;
  const g = (newColor >> 8) & 255;
  const b = newColor & 255;

  // HSP (Highly Sensitive Poo) equation from http://alienryderflex.com/hsp.html
  const hsp = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b));

  // Using the HSP value, determine whether the color is light or dark
  if (hsp > 127.5) {
    return "light";
  }
  return "dark";
}
