import PIXI from "pixi.js";

/**
 * Center a thing in the app view.
 * @param thing
 * @param app
 * @constructor
 */
export function Center(
  thing: PIXI.Graphics | PIXI.Container,
  app: PIXI.Application
): void {
  thing.x = app.screen.width / 2 - thing.width / 2;
  thing.y = app.screen.height / 2 - thing.height / 2;
}
