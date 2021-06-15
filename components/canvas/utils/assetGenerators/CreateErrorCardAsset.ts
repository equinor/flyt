import * as PIXI from "pixi.js";
import { getDefaultTextSprite } from "./GetDefaultTextSprite";
import { vsmObject } from "../../../../interfaces/VsmObject";

export function createErrorCardAsset(
  vsmObject: vsmObject,
  textResolution: number
): PIXI.Container {
  const { errorCard } = PIXI.Loader.shared.resources;
  const textSprite = getDefaultTextSprite(vsmObject, 100, null, textResolution);
  const wrapper = new PIXI.Container();
  wrapper.addChild(new PIXI.Sprite(errorCard.texture), textSprite);
  return wrapper;
}
