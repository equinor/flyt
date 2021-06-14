import * as PIXI from "pixi.js";
import { Graphics } from "pixi.js";

export function TextCircle(
  text = "?",
  background: PIXI.ILoaderResource,
  textResolution = 2
): PIXI.Container {
  const diameter = 26; // <- Must be the same as the circle sprite
  const circle = new PIXI.Sprite(background.texture);

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
  circleText.y = diameter / 2;
  circleText.x = diameter / 2;

  const circleContainer = new PIXI.Container();
  circleContainer.addChild(circle, circleText);
  return circleContainer;
}
