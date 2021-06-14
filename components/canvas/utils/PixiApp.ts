import { Application } from "pixi.js";

const pixiApp: Application = new Application({
  // resizeTo: window, //Todo: fix browser resizing ref: https://equinor-sds-si.atlassian.net/browse/VSM-119
  height: window.innerHeight - 70,
  width: window.innerWidth,
  backgroundColor: 0xf7f7f7,
  antialias: true,
});

export const getApp = (): Application => pixiApp;
