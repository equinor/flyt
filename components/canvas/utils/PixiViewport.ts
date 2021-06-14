import { Viewport } from "pixi-viewport";
import * as PIXI from "pixi.js";

const pixiViewport: Viewport = new Viewport({
  ticker: PIXI.Ticker.shared,
  // interaction: app.renderer.plugins.interaction, // the interaction module is important for wheel to work properly when renderer.view is placed or scaled
});

export function getViewPort(): Viewport {
  return pixiViewport;
}
