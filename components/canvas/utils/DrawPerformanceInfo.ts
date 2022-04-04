import * as PIXI from "pixi.js";

/**
 * Draws performance info to the screen.
 * fps - frames per second
 * @param app
 */
export function drawPerformanceInfo(app: PIXI.Application): () => void {
  const lastHundredMeasures = []; // last 100 measures, used to calculate average fps
  const style = new PIXI.TextStyle({
    fill: "white",
  });

  const background = new PIXI.Graphics();
  background.beginFill(0x000000, 0.8);
  background.drawRoundedRect(0, 0, 180, 80, 10);
  background.endFill();
  app.stage.addChild(background);

  const text = new PIXI.Text("", style);
  text.x = 20;
  text.y = 10;
  app.stage.addChild(text);

  const interval = setInterval(() => {
    const fps = app.ticker.FPS;

    lastHundredMeasures.push(fps);
    if (lastHundredMeasures.length > 100) {
      lastHundredMeasures.shift();
    }

    const average =
      lastHundredMeasures.reduce((a, b) => a + b, 0) /
      lastHundredMeasures.length;

    text.text = `FPS: ${fps.toFixed(0)}\nAverage: ${average.toFixed(0)}`;
  }, 10);

  return () => {
    clearInterval(interval);
  };
}
