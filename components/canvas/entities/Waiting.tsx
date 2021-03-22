import * as PIXI from "pixi.js";
import { Graphics } from "pixi.js";
import { formatCanvasText } from "../FormatCanvasText";
import { icons } from "../../../assets/icons";
import { clickHandler } from "./ClickHandler";
import { pointerEvents } from "../../VSMCanvas";
import { createSideContainer } from "./CreateSideContainer";
import { taskObject } from "../../../interfaces/taskObject";

export default function Waiting(
  time = "unknown",
  onPress?: () => void,
  onHover?: () => void,
  onHoverExit?: () => void,
  tasks?: taskObject[]
): PIXI.Container {
  const header = "Waiting";
  const width = 126;
  const color = 0xff8900;
  const height = 68;

  const background = new Graphics();
  background.beginFill(color);
  background.drawRect(0, 0, width, height);

  const sideContainer = createSideContainer(tasks, 2, background.height);
  sideContainer.x = background.width;

  const paddingLeft = 6;
  const paddingTop = 10;

  const defaultStyle = {
    fill: 0x3d3d3d,
    fontFamily: "Equinor",
    fontWeight: 500,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.2,
    wordWrapWidth: width - paddingLeft - 20,
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

  const mask = new PIXI.Graphics();
  mask.beginFill(color);
  mask.drawRoundedRect(0, 0, width + sideContainer.width, height, 6);
  background.mask = mask;
  sideContainer.mask = mask;
  textTime.mask = mask;

  const container = new PIXI.Container();
  container.addChild(mask, background, text, iconTime, textTime, sideContainer);

  const paddingContainer = new Graphics();
  paddingContainer.drawRect(0, 0, 126, 136);

  const withPadding = new PIXI.Container();
  withPadding.addChild(paddingContainer, container);
  container.y = paddingContainer.y + paddingContainer.height / 4;

  if (onHover) container.on(pointerEvents.pointerover, () => onHover());
  if (onHoverExit) container.on(pointerEvents.pointerout, () => onHoverExit());
  if (onPress) clickHandler(container, onPress);

  return withPadding;
}
