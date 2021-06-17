import PIXI from "pixi.js";
import { pointerEvents } from "../../../types/PointerEvents";

export function clickHandler(
  container: PIXI.Container,
  onPress: () => void
): void {
  container.interactive = true;

  // Fade out
  container.on(pointerEvents.pointerover, () => {
    container.alpha = 0.2;
    container.cursor = "pointer";
  });

  // Fade in
  container.on(pointerEvents.pointerout, () => {
    container.alpha = 1;
  });

  container.on(pointerEvents.click, onPress);
}
