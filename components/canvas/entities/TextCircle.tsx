import * as PIXI from "pixi.js";
import { Graphics } from "pixi.js";

export function TextCircle(
  text = "?",
  background: PIXI.ILoaderResource,
  textResolution = 2
): PIXI.Container {
  const circle = new PIXI.Sprite(background.texture);
  // circle.pivot.set(-circle.width / 2, -circle.height / 2);

  const circleText = new PIXI.Text(text, {
    fontFamily: "Equinor",
    fontSize: 12,
    fontStyle: "normal",
    fontWeight: "500",
    lineHeight: 16,
    letterSpacing: 0,
    fill: "white",
  });
  circleText.resolution = textResolution;
  // Center text
  circleText.anchor.set(0.5);
  circleText.y = circle.height / 2;
  circleText.x = circle.width / 2;

  const circleContainer = new PIXI.Container();
  circleContainer.addChild(circle, circleText);
  return circleContainer;
}
