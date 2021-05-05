import React from "react";
import { RecursiveState } from "easy-peasy";
import { vsmProject } from "../../interfaces/VsmProject";
import { setupCanvas } from "./setupCanvas";
import { addCardsToCanvas } from "./addCardsToCanvas";
import { cleanup } from "./cleanup";
import { vsmObject } from "../../interfaces/VsmObject";
import { addToolBox } from "../../components/AddToolBox";

/**
 * Handle the creation and cleanup of the vsm-canvas.
 * @param canvasRef
 * @param project
 * @param dispatch
 */
export function handleCanvas(
  canvasRef: React.MutableRefObject<HTMLCanvasElement>,
  project: RecursiveState<vsmProject>,
  dispatch: {
    setSelectedObject: (arg0: vsmObject) => void;
    setHoveredObject: (arg0: vsmObject) => void;
    clearHoveredObject: () => void;
  }
): () => unknown {
  const { app, viewport } = setupCanvas(canvasRef);
  addCardsToCanvas(project, viewport, dispatch);
  addToolBox(app, viewport, dispatch);
  return () => cleanup(viewport, app);
}
