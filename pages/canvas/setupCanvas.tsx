import React from "react";
import * as PIXI from "pixi.js";
import { Viewport } from "pixi-viewport";

/**
 * Setup Canvas | Pixi.JS Application
 *  Creates a new PIXI Application on a given canvas and returns the pixi app and a viewport that supports "scroll"-navigation
 * @param canvasRef
 */
export function setupCanvas(
  canvasRef: React.MutableRefObject<HTMLCanvasElement>
): { app: PIXI.Application; viewport: Viewport } {
  console.info("Initializing Canvas");
  const app = new PIXI.Application({
    // resizeTo: window,
    height: window.innerHeight - 70,
    width: window.innerWidth,
    backgroundColor: 0xf7f7f7,
    antialias: true,
  });
  canvasRef.current.appendChild(app.view);

  const viewport = new Viewport({
    interaction: app.renderer.plugins.interaction, // the interaction module is important for wheel to work properly when renderer.view is placed or scaled
  });
  viewport.drag().wheel().decelerate({ friction: 0.4 });
  app.stage?.addChild(viewport);
  return { app, viewport };
}
