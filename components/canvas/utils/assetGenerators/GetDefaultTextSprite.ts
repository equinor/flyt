import { vsmObject } from "../../../../interfaces/VsmObject";
import * as PIXI from "pixi.js";
import { formatCanvasText } from "../FormatCanvasText";
import { defaultTextStyle } from "../AssetFactory";

export function getDefaultTextSprite(
  { name }: vsmObject,
  maxLength = 60,
  placeholder = "",
  textResolution: number
) {
  const text = name ? name : placeholder;
  const textSprite = new PIXI.Text(
    formatCanvasText(text, maxLength),
    defaultTextStyle
  );
  textSprite.resolution = textResolution;
  textSprite.y = 8;
  textSprite.x = 12;
  textSprite.alpha = name ? 1 : 0.4;

  return textSprite;
}
