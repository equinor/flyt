import * as PIXI from "pixi.js";
import { Graphics, TextStyle } from "pixi.js";
import { formatCanvasText } from "../FormatCanvasText";
import { clickHandler } from "./ClickHandler";
import { pointerEvents } from "../../VSMCanvas";
import { taskObject } from "../../../interfaces/taskObject";
import { createSideContainer } from "./CreateSideContainer";

interface SubActivityProps {
  text?: string;
  role?: string;
  time?: string;
  onPress?: () => void;
  onHover?: () => void;
  onHoverExit?: () => void;
  disableSideContainer?: boolean;
  tasks?: taskObject[];
}

export default function SubActivity({
  text,
  role,
  time,
  onPress,
  onHover,
  onHoverExit,
  tasks,
  disableSideContainer = false,
}: SubActivityProps): PIXI.Container {
  const header = "Sub- activity";
  const width = 126;
  const height = 136;
  const paddingLeft = 8;
  const paddingTop = 10;

  function createBaseContainer() {
    const rectangle = new Graphics();
    rectangle.beginFill(0xffd800);
    rectangle.drawRect(0, 0, width, height);
    rectangle.endFill();
    return rectangle;
  }

  const rectangle = createBaseContainer();

  const sideContainer = createSideContainer(tasks, 4, 136);
  sideContainer.x = rectangle.width;

  const defaultStyle = {
    fill: 0x3d3d3d,
    fontFamily: "Equinor",
    fontWeight: "500",
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.2,
    wordWrapWidth: width - paddingLeft,
    wordWrap: true,
    breakWords: true,
    trim: true,
  } as TextStyle;

  const textElement = new PIXI.Text(
    formatCanvasText(text || header),
    defaultStyle
  );
  textElement.x = paddingLeft;
  textElement.y = paddingTop;
  textElement.alpha = text ? 1 : 0.4; //Hide it if we have text
  textElement.resolution = 4;

  const roleText = new PIXI.Text(
    formatCanvasText(role ?? "", 16),
    defaultStyle
  );
  roleText.resolution = 4;
  roleText.y = height - 40;
  roleText.x = 12;

  const timeText = new PIXI.Text(
    formatCanvasText(time ?? "", 16),
    defaultStyle
  );
  timeText.resolution = 4;
  timeText.y = height - 18;
  timeText.x = roleText.x;

  const roleBg = new PIXI.Graphics()
    .beginFill()
    .drawRect(0, height - 24 * 2, width, 24);
  roleBg.alpha = 0.04;

  const timeBg = new PIXI.Graphics()
    .beginFill()
    .drawRect(0, height - 24, width, 24);
  timeBg.alpha = 0.1;

  const mask = new PIXI.Graphics();
  mask.beginFill(0x000000);
  mask.drawRoundedRect(
    0,
    0,
    disableSideContainer ? width : width + sideContainer.width,
    height,
    6
  );
  rectangle.mask = mask;
  textElement.mask = mask;
  roleBg.mask = mask;
  roleText.mask = mask;
  timeBg.mask = mask;
  timeText.mask = mask;
  sideContainer.mask = mask;

  const container = new PIXI.Container();
  container.addChild(
    mask,
    rectangle,
    textElement,
    roleBg,
    roleText,
    timeBg,
    timeText,
    sideContainer
  );

  if (onHover) container.on(pointerEvents.pointerover, () => onHover());
  if (onHoverExit) container.on(pointerEvents.pointerout, () => onHoverExit());
  if (onPress) clickHandler(container, onPress);
  return container;
}
