import { Viewport } from "pixi-viewport";
import * as PIXI from "pixi.js";

export function cleanup(viewport: Viewport, app: PIXI.Application): void {
  //Todo: Does this work?
  viewport.destroy({
    children: true,
    texture: true,
    baseTexture: true,
  });
  app.destroy(true, {
    children: true,
    texture: true,
    baseTexture: true,
  });
  PIXI.utils.clearTextureCache();
  PIXI.utils.destroyTextureCache();
}
