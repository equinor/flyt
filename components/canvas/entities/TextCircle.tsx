import * as PIXI from "pixi.js";
import { Graphics } from "pixi.js";

export function TextCircle(text = "?", color = 0x000000): PIXI.Container {
  const circle = new Graphics();
  circle.beginFill(color);
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
  // Center text
  circleText.anchor.set(0.5);
  circleText.y = circle.height / 2;
  circleText.x = circle.width / 2;

  const circleContainer = new PIXI.Container();
  circleContainer.addChild(circle, circleText);
  return circleContainer;
}
