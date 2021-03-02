import * as PIXI from "pixi.js";
import { Graphics } from "pixi.js";
import { formatCanvasText } from "./FormatCanvasText";
import { clickHandler } from "./entities/ClickHandler";

interface Rectangle {
  options?: {
    color?: number;
  };
  header?: string;
  content?: string;
  onPress?: () => void;
  onHover?: () => void;
  hideTitle?: boolean;
}

export function GenericPostit({
  options: options = {
    color: 0x00d889,
  },
  hideTitle: hideTitle = false,
  header: header = "Header",
  content: content = "Content",
  onPress,
  onHover,
}: Rectangle) {
  const rectangle = new Graphics();
  const width = 126;
  const height = 136;
  rectangle.beginFill(options.color);
  rectangle.drawRoundedRect(0, 0, width, height, 6);
  rectangle.endFill();

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
    trim: true,
  };

  const headerText = new PIXI.Text(formatCanvasText(header, 18), defaultStyle);
  headerText.x = paddingLeft;
  headerText.y = paddingTop;
  headerText.alpha = 0.4;
  headerText.resolution = 4;

  const contentText = new PIXI.Text(formatCanvasText(content), defaultStyle);
  contentText.x = paddingLeft;
  contentText.y = hideTitle ? paddingTop : 28;
  contentText.resolution = 4;

  const container = new PIXI.Container();
  container.addChild(rectangle);
  if (!hideTitle) {
    container.addChild(headerText);
  }
  if (content) {
    container.addChild(contentText);
  }
  if (onHover) container.on("mouseover", () => onHover());
  if (onPress) clickHandler(container, onPress);

  return container;
}
