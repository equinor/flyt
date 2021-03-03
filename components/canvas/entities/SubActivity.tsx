import * as PIXI from "pixi.js";
import { Graphics } from "pixi.js";
import { formatCanvasText } from "../FormatCanvasText";
import { ProblemCircle } from "./ProblemCircle";
import { clickHandler } from "./ClickHandler";
import { pointerEvents } from "../../VSMCanvas";

interface SubActivityProps {
  text?: string;
  role?: string;
  time?: string;
  onPress?: () => void;
  onHover?: () => void;
  onHoverExit?: () => void;
  disableSideContainer?: boolean;
}

export default function SubActivity({
  text,
  role,
  time,
  onPress,
  onHover,
  onHoverExit,
  disableSideContainer = true,
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

  function createSideContainer() {
    // todo: SideContainer stuff. I started it off for you with some demo content ;)
    const rectangleSide = new Graphics();
    rectangleSide.beginFill(0xededed);
    rectangleSide.drawRect(0, 0, 71, 136);
    rectangleSide.endFill();

    const c1 = ProblemCircle("P1");
    c1.x = rectangleSide.x + 4;
    c1.y = rectangleSide.y + 4;
    const c2 = ProblemCircle("P2");
    c2.x = c1.x;
    c2.y = c1.y + c1.height + 4;
    const c3 = ProblemCircle("P3");
    c3.x = c2.x;
    c3.y = c2.y + c2.height + 4;

    const sideContainer = new PIXI.Container();
    sideContainer.x = rectangle.width;
    sideContainer.addChild(rectangleSide, c1, c2, c3);
    return sideContainer;
  }

  const sideContainer = createSideContainer();

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

  const textElement = new PIXI.Text(
    formatCanvasText(text || header, 118),
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

  if (onHover) container.on(pointerEvents.mouseover, () => onHover());
  if (onHoverExit) container.on(pointerEvents.mouseout, () => onHoverExit());
  if (onPress) clickHandler(container, onPress);
  return container;
}
