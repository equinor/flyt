import * as PIXI from "pixi.js";
import { Graphics } from "pixi.js";

export function ProblemCircle(text = "P?") {
  const circle = new Graphics();
  circle.beginFill(0xff0000);
  circle.drawCircle(0, 0, 13);
  circle.endFill();
  circle.pivot.set(-circle.width / 2, -circle.height / 2);

  const circleText = new PIXI.Text(text, {
    styleName: "Input/Label",
    fontFamily: "Equinor",
    fontSize: 12,
    fontStyle: "normal",
    fontWeight: 500,
    lineHeight: 16,
    letterSpacing: 0,
    fill: "white",
    fontColor: "white",
  });
  circleText.resolution = 4;
  circleText.x = circle.width / 4;
  circleText.y = circle.height / 4;

  const circleContainer = new PIXI.Container();
  circleContainer.addChild(circle, circleText);
  return circleContainer;
}
