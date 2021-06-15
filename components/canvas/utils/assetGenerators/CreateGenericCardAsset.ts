import * as PIXI from "pixi.js";
import { getDefaultTextSprite } from "./GetDefaultTextSprite";
import { vsmObject } from "../../../../interfaces/VsmObject";
import { defaultTextStyle } from "../AssetFactory";

export function createGenericCardAsset(
  vsmObject: vsmObject,
  title = "",
  textResolution: number
) {
  const wrapper = new PIXI.Container();

  const { generic } = PIXI.Loader.shared.resources;
  wrapper.addChild(new PIXI.Sprite(generic.texture));

  if (title) {
    const titleSprite = new PIXI.Text(title, defaultTextStyle);
    titleSprite.alpha = 0.4;
    titleSprite.y = 8;
    titleSprite.x = 12;
    wrapper.addChild(titleSprite);
  }

  const textSprite = getDefaultTextSprite(vsmObject, 100, null, textResolution);
  textSprite.y = 21;
  wrapper.addChild(textSprite);

  return wrapper;
}
