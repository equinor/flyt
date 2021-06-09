import * as PIXI from "pixi.js";
import { Graphics } from "pixi.js";
import { formatCanvasText } from "../utils/FormatCanvasText";
import { clickHandler } from "./ClickHandler";
import { pointerEvents } from "../../VSMCanvas";

interface ChoiceProps {
  content?: string;
  onPress?: () => void;
  onHover?: () => void;
  onHoverExit?: () => void;
}

export default function Choice({
  content,
  onPress,
  onHover,
  onHoverExit,
}: ChoiceProps) {
  const defaultCardWidth = 126;
  const width = defaultCardWidth;
  const color = 0xffd800;

  // Create a rectangle and rotate it 45 degrees
  const rectangle = new Graphics();
  rectangle.beginFill(color);
  const edge = Math.sqrt(width ** 2 / 2);
  rectangle.drawRoundedRect(0, 0, edge, edge, 6);

  rectangle.pivot.x = rectangle.width / 2;
  rectangle.pivot.y = rectangle.height / 2;

  rectangle.angle = 45;

  const defaultCardHeight = 136;
  rectangle.x = defaultCardWidth / 2;
  rectangle.y = defaultCardHeight / 2;

  const contentText = new PIXI.Text(formatCanvasText(content || "Choice", 45), {
    fill: 0x3d3d3d,
    fontFamily: "Equinor",
    fontWeight: "500",
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

  contentText.x = defaultCardWidth / 2;
  contentText.y = defaultCardHeight / 2;

  const container = new PIXI.Container();

  container.addChild(rectangle, contentText);

  if (onHover) container.on(pointerEvents.pointerover, () => onHover());
  if (onHoverExit) container.on(pointerEvents.pointerout, () => onHoverExit());
  if (onPress) clickHandler(container, onPress);
  return container;
}
