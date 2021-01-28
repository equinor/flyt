import * as PIXI from "pixi.js";
import { Graphics } from "pixi.js";
import { truncateText } from "./TruncateText";
import { ScaleOnHover } from "./entities/ScaleOnHover";

interface Rectangle {
  options?: {
    color: number;
    height: number;
    width: number;
    x: number;
    y: number;
    scale: number;
  };
  header?: string;
  content?: string;
}

export function GenericPostit({
  options: options = {
    x: 0,
    y: 0,
    width: 126,
    height: 136,
    color: 0x00d889,
    scale: 1,
  },
  header: header = "Header",
  content: content = "Content",
}: Rectangle) {
  const rectangle = new Graphics();
  rectangle.beginFill(options.color);
  rectangle.drawRoundedRect(
    0,
    0,
    options.width * options.scale,
    options.height * options.scale,
    4 * options.scale
  );
  rectangle.endFill();

  const paddingLeft = 8;
  const paddingTop = 10;

  const width = 126;
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

  const headerText = new PIXI.Text(truncateText(header, 18), defaultStyle);
  headerText.x = paddingLeft;
  headerText.y = paddingTop;
  headerText.alpha = 0.4;
  headerText.resolution = 4;

  const contentText = new PIXI.Text(truncateText(content), defaultStyle);
  contentText.x = paddingLeft;
  contentText.y = 28;
  contentText.resolution = 4;

  const container = new PIXI.Container();
  container.addChild(rectangle, headerText, contentText);

  container.x = options.x;
  container.y = options.y;

  ScaleOnHover(container);
  return container;
}
