import * as PIXI from "pixi.js";
import { Graphics } from "pixi.js";
import { formatCanvasText } from "../FormatCanvasText";
import { ScaleOnHover } from "./ScaleOnHover";

const icons = {
  time:
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTEyIDJDNi41IDIgMiA2LjUgMiAxMnM0LjUgMTAgMTAgMTAgMTAtNC41IDEwLTEwUzE3LjUgMiAxMiAyem0wIDE4Yy00LjQxIDAtOC0zLjU5LTgtOHMzLjU5LTggOC04IDggMy41OSA4IDgtMy41OSA4LTggOHpNMTEgN2gxLjV2NS4ybDQuNSAyLjctLjggMS4zTDExIDEzVjd6Ii8+PC9zdmc+",
};

export default function Box(
  app: PIXI.Application,
  time = "unknown",
  x = 0,
  y = 0,
  onPress?: () => void
): void {
  // const time = "5 min";
  const scale = 1;
  const width = 126;
  const color = 0xff8900;
  const height = 68;

  const background = new Graphics();
  background.beginFill(color);
  background.drawRoundedRect(0, 0, width * scale, height * scale, 4 * scale);

  const container = new PIXI.Container();
  container.addChild(background);
  container.x = x;
  container.y = y;
  ScaleOnHover(container);
  if (onPress) {
    container.on("pointerdown", onPress);
  }

  app.stage.addChild(container);
}
