import * as PIXI from "pixi.js";

import { GraphEdge } from "utils/layoutEngine";
import { Viewport } from "pixi-viewport";

let edgeCache: { [key: string]: PIXI.Graphics } = {};
let labelCache: { [key: string]: PIXI.Text } = {};

/**
 * Draws the edges of the graph. If the edge is not in the cache, it will be created and added to the cache.
 * @param edges - edges to draw
 * @param viewport - viewport to draw on
 */
export function drawGraphEdges(edges: GraphEdge[], viewport: Viewport): void {
  edges.forEach((edge) => {
    const { from, to } = edge;
    const key = `${from}-${to}`;
    // line
    if (!edgeCache[key]) {
      // create line
      const line = new PIXI.Graphics();
      //bezier curve line
      line.lineStyle(2, 0x000000, edge.highlighted ? 1 : 0.1);
      line.moveTo(edge.position.start.x, edge.position.start.y);
      line.bezierCurveTo(
        edge.position.start.x,
        edge.position.start.y + 20,
        edge.position.end.x,
        edge.position.end.y - 20,
        edge.position.end.x,
        edge.position.end.y
      );

      viewport.addChild(line);
      edgeCache[key] = line;
    } else {
      // update line
      edgeCache[key].clear();
      edgeCache[key].lineStyle(2, 0x000000, edge.highlighted ? 1 : 0.1);
      edgeCache[key].moveTo(edge.position.start.x, edge.position.start.y);
      edgeCache[key].bezierCurveTo(
        edge.position.start.x,
        edge.position.start.y + 20,
        edge.position.end.x,
        edge.position.end.y - 20,
        edge.position.end.x,
        edge.position.end.y
      );
    }

    // label
    if (!labelCache[key]) {
      // create label
      const label = new PIXI.Text(edge.label, {
        fontFamily: "Equinor",
        fontSize: 14,
      });
      label.resolution = 2;
      label.x =
        (edge.position.start.x + edge.position.end.x) / 2 - label.width / 2;
      label.y =
        (edge.position.start.y + edge.position.end.y) / 2 - label.height / 2;
      viewport.addChild(label);
      labelCache[key] = label;
    } else {
      labelCache[key].text = edge.label;
      // update label
      labelCache[key].x =
        (edge.position.start.x + edge.position.end.x) / 2 -
        labelCache[key].width / 2;
      labelCache[key].y =
        (edge.position.start.y + edge.position.end.y) / 2 -
        labelCache[key].height / 2;
    }
  });
}

/**
 * Removes all edges from the viewport. Also clears the cache.
 * @param viewport - viewport to remove from
 */
export const clearGraphEdges = (viewport: Viewport): void => {
  for (const key in edgeCache) {
    edgeCache[key].clear();
    viewport.removeChild(edgeCache[key]);
  }
  for (const key in labelCache) {
    viewport.removeChild(labelCache[key]);
  }
  edgeCache = {};
  labelCache = {};
};
