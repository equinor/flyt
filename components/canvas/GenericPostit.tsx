import * as PIXI from "pixi.js";
import { Graphics, TextStyle } from "pixi.js";
import { formatCanvasText } from "./FormatCanvasText";
import { clickHandler } from "./entities/ClickHandler";
import { pointerEvents } from "../VSMCanvas";
import { createSideContainer } from "./entities/CreateSideContainer";
import { taskObject } from "../../interfaces/taskObject";

interface Rectangle {
  options?: {
    color?: number;
  };
  header?: string;
  content?: string;
  onPress?: () => void;
  onHover?: () => void;
  onHoverExit?: () => void;
  hideTitle?: boolean;
  tasks?: taskObject[];
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
  onHoverExit,
  tasks,
}: Rectangle) {
  const rectangle = new Graphics();
  const width = 126;
  const height = 136;
  rectangle.beginFill(options.color);
  rectangle.drawRect(0, 0, width, height);
  rectangle.endFill();

  const sideContainer = createSideContainer(tasks, 4, rectangle.height);
  sideContainer.x = rectangle.width;

  const paddingLeft = 8;
  const paddingTop = 10;

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

  const mask = new PIXI.Graphics();
  mask.beginFill(0x000000);
  mask.drawRoundedRect(0, 0, width + sideContainer.width, height, 6);
  rectangle.mask = mask;
  contentText.mask = mask;
  headerText.mask = mask;
  sideContainer.mask = mask;

  const maskedContainer = new PIXI.Container();
  maskedContainer.addChild(
    mask,
    rectangle,
    contentText,
    headerText,
    sideContainer
  );

  if (onHover) maskedContainer.on(pointerEvents.pointerover, () => onHover());
  if (onHoverExit)
    maskedContainer.on(pointerEvents.pointerout, () => onHoverExit());
  if (onPress) clickHandler(maskedContainer, onPress);

  return maskedContainer;
}
