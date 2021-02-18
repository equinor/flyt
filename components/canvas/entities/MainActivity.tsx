import * as PIXI from "pixi.js";
import { Graphics } from "pixi.js";
import { formatCanvasText } from "../FormatCanvasText";
import { ScaleOnHover } from "./ScaleOnHover";
import { ProblemCircle } from "./ProblemCircle";

interface MainActivityProps {
  header?: string;
  text?: string;
  onPress?: () => void;
  role?: string,
  time?: string
}

export default function MainActivity(
  {
    header = "MainActivity",
    text = "Choose method",
    onPress,
    role,
    time
  }: MainActivityProps): PIXI.Container {
  const rectangle = new Graphics();
  const color = 0x00c1ff;
  const width = 126;
  rectangle.beginFill(color);
  const height = 136;
  rectangle.drawRect(0, 0, width, height);
  rectangle.endFill();

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

  const paddingLeft = 8;
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
    trim: true
  };
  const textElement = new PIXI.Text(
    formatCanvasText(text || header, 55),
    defaultStyle
  );
  textElement.x = paddingLeft;
  textElement.y = paddingTop;
  textElement.alpha = text ? 1 : 0.4; //Hide it if we have text
  textElement.resolution = 4;

  const roleText = new PIXI.Text(formatCanvasText(role ?? "",16), defaultStyle);
  roleText.resolution = 4;
  roleText.y = height - 39;
  roleText.x = 12;

  const rectangleRole = new Graphics();
  rectangleRole.beginFill(0x000000);
  rectangleRole.drawRect(0, 0, width, 24);
  rectangleRole.endFill();
  rectangleRole.y = roleText.y - roleText.height;
  rectangleRole.alpha = 0.04;

  const timeText = new PIXI.Text(formatCanvasText(time ?? "",16), defaultStyle);
  timeText.resolution = 4;
  timeText.y = height - timeText.height - 6;
  timeText.x = 12;

  const rectangleTime = new Graphics();
  rectangleTime.beginFill(0x000000);
  rectangleTime.drawRect(0, 0, width, 24);
  rectangleTime.endFill();
  rectangleTime.y = timeText.y - timeText.height;
  rectangleTime.alpha = 0.1;

  const enableSideContainer = false;
  const mask = new PIXI.Graphics();
  mask.beginFill(0x000000);
  mask.drawRoundedRect(
    0,
    0,
    enableSideContainer ? width + sideContainer.width : width,
    height,
    6
  );
  rectangleTime.mask = mask;
  rectangle.mask = mask;
  sideContainer.mask = mask;
  const container = new PIXI.Container();

  container.addChild(
    mask,
    rectangle,
    textElement,
    rectangleRole,
    roleText,
    timeText,
    rectangleTime,
    sideContainer
  );

  if (onPress) {
    ScaleOnHover(container);
    container.on("pointerdown", onPress);
  }

  return container;
}
