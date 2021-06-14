import * as PIXI from "pixi.js";
import { getDefaultTextSprite } from "./GetDefaultTextSprite";
import { vsmObject } from "../../../../interfaces/VsmObject";

export function createGenericCardAsset(
  vsmObject: vsmObject,
  placeholder = "",
  textResolution: number
) {
  const { generic } = PIXI.Loader.shared.resources;
  const textSprite = getDefaultTextSprite(
    vsmObject,
    100,
    placeholder,
    textResolution
  );
  const wrapper = new PIXI.Container();
  wrapper.addChild(new PIXI.Sprite(generic.texture), textSprite);
  return wrapper;
}
