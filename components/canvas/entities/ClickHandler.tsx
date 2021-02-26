import PIXI from "pixi.js";

export function clickHandler(
  container: PIXI.Container,
  onPress: () => void
): void {
  container.interactive = true;

  // Fade out
  container.on("mouseover", () => {
    container.alpha = 0.2;
  });

  // Fade in
  container.on("mouseout", () => {
    container.alpha = 1;
  });

  container.on("pointertap", onPress);
}
