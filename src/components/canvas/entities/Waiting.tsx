import * as PIXI from "pixi.js";
import { Graphics } from "pixi.js";
import { truncateText } from "../TruncateText";
import { ScaleOnHover } from "./ScaleOnHover";
import { icons } from "../../../assets/icons";

export default function Waiting(
  time = "unknown",
  x = 0,
  y = 0,
  onPress?: () => void
): PIXI.Container {
  // const time = "5 min";
  const header = "Waiting";
  const width = 126;
  const color = 0xff8900;
  const height = 68;

  const background = new Graphics();
  background.beginFill(color);
  // background.lineStyle(4, 0x00_00_00, 0.1);
  background.drawRoundedRect(0, 0, width, height, 4);

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

  const text = new PIXI.Text(truncateText(header, 18), defaultStyle);
  text.x = paddingLeft;
  text.y = paddingTop;
  text.alpha = 0.4;
  text.resolution = 4;

  const texture = PIXI.Texture.from(icons.time);
  const iconTime = new PIXI.Sprite(texture);
  iconTime.anchor.set(0, 0.3);

  iconTime.x = paddingLeft;
  iconTime.y = height / 2;

  const textTime = new PIXI.Text(truncateText(time, 18), defaultStyle);
  textTime.x = paddingLeft + iconTime.x + 20;
  textTime.y = iconTime.y;
  textTime.resolution = 4;
  // textTime.roundPixels = true;

  const container = new PIXI.Container();
  container.addChild(background, text, iconTime, textTime);
  container.x = x;
  container.y = y;

  if (onPress) {
    ScaleOnHover(container);
    container.on("pointerdown", onPress);
  }

  return container;
}
