import * as PIXI from "pixi.js";

export function AddRotatingBunnies(app: PIXI.Application): void {
  // Create a new texture
  const texture = PIXI.Texture.from(
    "https://pixijs.io/examples/examples/assets/bunny.png"
  );

  const container = new PIXI.Container();

  // Create a 5x5 grid of bunnies
  for (let i = 0; i < 25; i++) {
    const bunny = new PIXI.Sprite(texture);
    bunny.anchor.set(0.5);
    bunny.x = (i % 5) * 40;
    bunny.y = Math.floor(i / 5) * 40;
    container.addChild(bunny);

    app.ticker.add((delta) => {
      bunny.rotation += 0.001 * delta;
    });
  }
  app.stage.addChild(container);

  // Move container to the center
  container.x = app.screen.width / 2;
  container.y = app.screen.height / 2;

  // Utils bunny sprite in local container coordinates
  container.pivot.x = container.width / 2;
  container.pivot.y = container.height / 2;

  // Listen for animate update
  app.ticker.add((delta) => {
    // rotate the container!
    // use delta to create frame-independent transform
    container.rotation -= 0.001 * delta;
  });
}
