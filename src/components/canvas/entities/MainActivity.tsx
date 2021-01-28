import * as PIXI from "pixi.js";
import { Graphics } from "pixi.js";
import { truncateText } from "../TruncateText";
import { ScaleOnHover } from "./ScaleOnHover";
import { icons } from "../../../assets/icons";
import { ProblemCircle } from "./ProblemCircle";

interface MainActivityProps {
  x: number;
  y: number;
  header?: string;
  content?: string;
}

export default function MainActivity({
  header = "MainActivity",
  content = "Choose method",
  x,
  y,
}: MainActivityProps): PIXI.Container {
  const rectangle = new Graphics();
  const color = 0x00c1ff;
  const width = 126;
  rectangle.beginFill(color);
  const height = 136;
  rectangle.drawRoundedRect(0, 0, width, height, 4);
  rectangle.endFill();

  const texture = PIXI.Texture.from(icons.add_outline);
  const iconTime = new PIXI.Sprite(texture);
  iconTime.anchor.set(0, 0.3);

  iconTime.x = width - 30;
  iconTime.y = 10;

  const rectangleSide = new Graphics();
  rectangleSide.beginFill(0xededed);
  rectangleSide.drawRoundedRect(0, 0, 71, 136, 4);
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
    trim: true,
  };

  const headerText = new PIXI.Text(truncateText(header, 18), defaultStyle);
  headerText.x = paddingLeft;
  headerText.y = paddingTop;
  headerText.alpha = 0.4;
  headerText.resolution = 4;

  const contentText = new PIXI.Text(truncateText(content, 55), defaultStyle);
  contentText.x = paddingLeft;
  contentText.y = 28;
  contentText.resolution = 4;

  const roleText = new PIXI.Text(truncateText("Role"), defaultStyle);
  roleText.resolution = 4;
  roleText.y = height - 24;
  roleText.x = 12;

  const horizontalLine = new PIXI.Graphics();
  horizontalLine.lineStyle(2, 0x000000).moveTo(0, 0).lineTo(width, 0);
  horizontalLine.y = height - 40;
  horizontalLine.alpha = 0.1;

  const verticalLine = new PIXI.Graphics();
  verticalLine
    .lineStyle(2, 0x000000)
    .moveTo(0, horizontalLine.y)
    .lineTo(0, height);
  verticalLine.x = width / 2;

  verticalLine.alpha = 0.1;

  const timeText = new PIXI.Text(truncateText("1 min"), defaultStyle);
  timeText.resolution = 4;
  timeText.y = height - 24;
  timeText.x = width / 2 + width / 8;

  const container = new PIXI.Container();
  container.addChild(
    rectangle,
    headerText,
    iconTime,
    contentText,
    roleText,
    timeText,
    sideContainer,
    horizontalLine,
    verticalLine
  );

  container.x = x;
  container.y = y;

  ScaleOnHover(container);
  return container;
}
