import * as PIXI from "pixi.js";
import { Graphics } from "pixi.js";
import { formatCanvasText } from "../FormatCanvasText";
import { icons } from "../../../assets/icons";
import { clickHandler } from "./ClickHandler";

export default function Waiting(
  time = "unknown",
  onPress?: () => void
): PIXI.Container {
  const header = "Waiting";
  const width = 126;
  const color = 0xff8900;
  const height = 68;

  const background = new Graphics();
  background.beginFill(color);
  background.drawRoundedRect(0, 0, width, height, 6);

  const paddingLeft = 6;
  const paddingTop = 10;

  const defaultStyle = {
    fontFamily: "Equinor",
    fontWeight: 500,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.2,
    wordWrapWidth: width - paddingLeft,
    wordWrap: true,
    breakWords: true,
    trim: true,
  };

  const text = new PIXI.Text(formatCanvasText(header, 18), defaultStyle);
  text.x = paddingLeft;
  text.y = paddingTop;
  text.alpha = 0.4;
  text.resolution = 4;

  const texture = PIXI.Texture.from(icons.time);
  const iconTime = new PIXI.Sprite(texture);
  iconTime.anchor.set(0, 0.3);

  iconTime.x = paddingLeft;
  iconTime.y = height / 2;

  const textTime = new PIXI.Text(formatCanvasText(time, 18), defaultStyle);
  textTime.x = paddingLeft + iconTime.x + 20;
  textTime.y = iconTime.y;
  textTime.resolution = 4;

  const container = new PIXI.Container();
  container.addChild(background, text, iconTime, textTime);

  const paddingContainer = new Graphics();
  paddingContainer.drawRect(0, 0, 126, 136);

  const withPadding = new PIXI.Container();
  withPadding.addChild(paddingContainer, container);
  container.y = paddingContainer.y + paddingContainer.height / 4;

  if (onPress) clickHandler(container, onPress);
  return withPadding;
}
