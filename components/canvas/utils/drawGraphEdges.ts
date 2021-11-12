import { Viewport } from "pixi-viewport";
import { GraphEdge } from "utils/layoutEngine";
import * as PIXI from "pixi.js";

export function drawGraphEdges(edges: GraphEdge[], viewport: Viewport): void {
  edges.forEach((edge) => {
    if (!edge.hidden) {
      //Draw a line between the two nodes
      const line = new PIXI.Graphics();
      line.lineStyle(2, 0x000000, 0.1);
      line.moveTo(edge.position.start.x, edge.position.start.y);
      line.lineTo(edge.position.end.x, edge.position.end.y);
      viewport.addChild(line);

      //Add a label to the edge
      if (edge.label) {
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
      }
    }
  });
}
