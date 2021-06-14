import * as PIXI from "pixi.js";
import { getDefaultTextSprite } from "./GetDefaultTextSprite";
import { vsmObject } from "../../../../interfaces/VsmObject";

export function createMainActivityAsset(
  vsmObject: vsmObject,
  textResolution: number
): PIXI.Container {
  const { mainActivity } = PIXI.Loader.shared.resources;
  const textSprite = getDefaultTextSprite(vsmObject, 100, null, textResolution);

  const mainActivitySprite = new PIXI.Sprite(mainActivity.texture);

  const wrapper = new PIXI.Container();
  wrapper.addChild(mainActivitySprite, textSprite);
  return wrapper;
}