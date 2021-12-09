export function randomColor(): string {
  const color = "#" + Math.floor(Math.random() * 16777215).toString(16);
  // Check if it generated a valid hex color. If not, try again
  return /^#[0-9A-F]{6}$/i.test(color) ? color : randomColor();
}
