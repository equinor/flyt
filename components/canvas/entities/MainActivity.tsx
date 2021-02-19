import * as PIXI from "pixi.js";
import { Graphics } from "pixi.js";
import { formatCanvasText } from "../FormatCanvasText";
import { ScaleOnHover } from "./ScaleOnHover";
import { ProblemCircle } from "./ProblemCircle";

interface MainActivityProps {
  header?: string;
  text?: string;
  onPress?: () => void;
}

export default function MainActivity(
  {
    header = "MainActivity",
    text = "Choose method",
    onPress
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

  const mask = new PIXI.Graphics();
  mask.beginFill(0x000000);
  mask.drawRoundedRect(
    0,
    0,
    width,
    height,
    6
  );
  rectangle.mask = mask;
  sideContainer.mask = mask;
  const container = new PIXI.Container();

  container.addChild(
    mask,
    rectangle,
    textElement,
    sideContainer
  );

  if (onPress) {
    ScaleOnHover(container);
    container.on("pointerdown", onPress);
  }

  return container;
}
