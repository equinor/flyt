import * as PIXI from "pixi.js";
import { Graphics } from "pixi.js";
import { formatCanvasText } from "../FormatCanvasText";
import { ScaleOnHover } from "./ScaleOnHover";
import { clickHandler } from "./ClickHandler";

interface ChoiceProps {
  x: number;
  y: number;
  content?: string;
  onPress?: () => void;
}

export default function Choice({
  x,
  y,
  content: content = "Choice",
  onPress,
}: ChoiceProps) {
  const width = 126;
  const height = 126;
  const color = 0xffd800;

  // Create a rectangle and rotate it 45 degrees
  const rectangle = new Graphics();
  rectangle.beginFill(color);
  rectangle.drawRoundedRect(0, 0, width, height, 4);
  rectangle.pivot.x = rectangle.width / 2;
  rectangle.pivot.y = rectangle.height / 2;
  rectangle.angle = 45;

  // Put it in a container so that we easier set the width, height and position
  const rectangleContainer = new PIXI.Container();
  rectangleContainer.addChild(rectangle);
  rectangleContainer.x = width / 2;
  rectangleContainer.y = width / 2;
  rectangleContainer.width = width;
  rectangleContainer.height = height;

  const contentText = new PIXI.Text(formatCanvasText(content, 45), {
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
  contentText.alpha = content === "Choice" ? 0.4 : 1;
  contentText.anchor.set(0.5, 0.5);
  contentText.x = width / 2;
  contentText.y = height / 2;
  contentText.resolution = 4;

  const container = new PIXI.Container();

  container.addChild(rectangleContainer, contentText);

  container.x = x;
  container.y = y;
  if (onPress) clickHandler(container, onPress);
  return container;
}
