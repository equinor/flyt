import * as PIXI from "pixi.js";
import { Application } from "pixi.js";

/**
 * get the current draw performance of the canvas
 * @param app the application to get the draw performance from
 * @param callBack the function to call when the draw performance is ready
 * @param ms the time in ms to wait before starting over again (looping)
 * @return NodeJS.Timer the timer that will call the function, use it to stop the timer
 */
export const getPerformance = (app: Application, callBack, ms = 100) => {
  const lastFiftyMeasures: number[] = []; // last 50 measures, used to calculate average fps
  return setInterval(() => {
    const current = app.ticker.FPS;

    lastFiftyMeasures.push(current);
    if (lastFiftyMeasures.length > 50) {
      lastFiftyMeasures.shift();
    }

    const average =
      lastFiftyMeasures.reduce((a, b) => a + b, 0) / lastFiftyMeasures.length;

    const humanReadable = `${Math.round(average)} fps`;

    // Excellent, good, ok, bad, terrible
    let performance = "";
    if (average > 60) {
      performance = "Excellent";
    } else if (average > 40) {
      performance = "Good";
    } else if (average > 20) {
      performance = "OK";
    } else if (average > 10) {
      performance = "Bad";
    } else {
      performance = "Terrible";
    }

    if (lastFiftyMeasures.length < 40) {
      performance = "Measuring";
    }

    const low = Math.min(...lastFiftyMeasures).toFixed(2);
    const high = Math.max(...lastFiftyMeasures).toFixed(2);

    callBack({ current, average, humanReadable, performance, low, high });
  }, ms);
};

/**
 * Draws performance info to the screen.
 * fps - frames per second
 * @param app
 */
export function drawPerformanceInfo(app: PIXI.Application) {
  const style = new PIXI.TextStyle({
    fill: "white",
  });

  const background = new PIXI.Graphics();
  background.beginFill(0x000000, 0.8);
  background.drawRoundedRect(0, 0, 180, 170, 10);
  background.endFill();
  app.stage.addChild(background);

  const text = new PIXI.Text("", style);
  text.x = 20;
  text.y = 10;
  app.stage.addChild(text);

  const interval = getPerformance(
    app,
    ({ current, average, performance, low, high }) => {
      return (text.text = `FPS: ${current.toFixed(
        0
      )}\nAverage: ${average.toFixed(
        0
      )}\n${performance}\nLow: ${low}\nHigh: ${high}`);
    }
  );
  const stop = () => {
    clearInterval(interval);
  };

  return {
    stop,
    remove: () => {
      stop();
      app.stage.removeChild(background);
      app.stage.removeChild(text);
    },
  };
}
