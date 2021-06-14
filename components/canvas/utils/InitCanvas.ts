import React from "react";
import { getApp } from "./PixiApp";
import { getViewPort } from "./PixiViewport";
import { isMobile } from "react-device-detect";

export function initCanvas(ref: React.MutableRefObject<HTMLDivElement>): void {
  const app = getApp();
  // Make sure the app.stage is empty
  app.stage.removeChildren();
  // add the viewport to the stage
  app.stage.addChild(getViewPort());

  if (isMobile) {
    getViewPort()
      .drag()
      .pinch() // Pinch doesn't work that well on desktop.
      .wheel()
      .decelerate({ friction: 0.4 });
  } else getViewPort().drag().wheel().decelerate({ friction: 0.4 });

  // Add app to DOM
  ref.current.appendChild(app.view);

  app?.start();

  console.info("Initialized canvas");
}
