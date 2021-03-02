import * as PIXI from "pixi.js";
import { Graphics } from "pixi.js";
import { formatCanvasText } from "../FormatCanvasText";
import { clickHandler } from "./ClickHandler";

interface ChoiceProps {
  content?: string;
  onPress?: () => void;
  onHover?: () => void;
}

export default function Choice({ content, onPress, onHover }: ChoiceProps) {
  const width = 126;
  const color = 0xffd800;

  // Create a rectangle and rotate it 45 degrees
  const rectangle = new Graphics();
  rectangle.beginFill(color);
  const edge = Math.sqrt(width ** 2 / 2);
  rectangle.drawRoundedRect(0, 0, edge, edge, 6);

  rectangle.pivot.x = rectangle.width / 2;
  rectangle.pivot.y = rectangle.height / 2;

  rectangle.angle = 45;

  const contentText = new PIXI.Text(formatCanvasText(content || "Choice", 45), {
    fontFamily: "Equinor",
    fontWeight: 500,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.2,
    wordWrapWidth: width / 1.4,
    wordWrap: true,
    breakWords: true,
    trim: true,
    align: "center",
  });
  contentText.alpha = content ? 1 : 0.4;
  contentText.anchor.set(0.5, 0.5);
  contentText.resolution = 4;

  const container = new PIXI.Container();

  container.addChild(rectangle, contentText);
  container.x = container.width / 2;
  container.y = container.height / 2;

  if (onHover) container.on("mouseover", () => onHover());
  if (onPress) clickHandler(container, onPress);
  return container;
}
