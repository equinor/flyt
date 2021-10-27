import { getViewPort } from "./PixiViewport";

export function resetCanvasZoomAndPosition(options?: {
  fitWidth?: number;
  fitHeight?: number;
}): void {
  const viewPort = getViewPort();
  viewPort.setZoom(1); //viewport position depends on the zoom...
  if (options?.fitWidth || options?.fitHeight) {
    viewPort.fit(false, options.fitWidth, options.fitHeight);
  }
  viewPort.x = 0;
  viewPort.y = 0;
}
