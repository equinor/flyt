import * as PIXI from "pixi.js";
import { Graphics } from "pixi.js";
import { formatCanvasText } from "../FormatCanvasText";
import { clickHandler } from "./ClickHandler";

interface MainActivityProps {
  header?: string;
  text?: string;
  onPress?: () => void;
  onHover?: () => void;
}

export default function MainActivity({
  header = "MainActivity",
  text = "Choose method",
  onPress,
  onHover,
}: MainActivityProps): PIXI.Container {
  const rectangle = new Graphics();
  const color = 0x00c1ff;
  const width = 126;
  const height = 136;
  rectangle.beginFill(color);
  rectangle.drawRect(0, 0, width, height);
  rectangle.endFill();

  const paddingLeft = 8;
  const paddingTop = 10;

  const defaultStyle = {
    fontFamily: "Equinor",
    fontWeight: 500,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.2,
    wordWrapWidth: width - paddingLeft * 2,
    wordWrap: true,
    breakWords: true,
    trim: true,
  };
  const textElement = new PIXI.Text(
    formatCanvasText(text || header, 118),
    defaultStyle
  );
  textElement.x = paddingLeft;
  textElement.y = paddingTop;
  textElement.alpha = text ? 1 : 0.4; //Hide it if we have text
  textElement.resolution = 4;

  const mask = new PIXI.Graphics();
  mask.beginFill(0x000000);
  mask.drawRoundedRect(0, 0, width, height, 6);
  rectangle.mask = mask;
  textElement.mask = mask;

  const container = new PIXI.Container();
  container.addChild(mask, rectangle, textElement);

  if (onHover) container.on("mouseover", () => onHover());
  if (onPress) clickHandler(container, onPress);

  return container;
}
