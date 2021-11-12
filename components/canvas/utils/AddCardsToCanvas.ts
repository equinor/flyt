import { Viewport } from "pixi-viewport";
import { assetFactory } from "./AssetFactory";
import { Graph } from "utils/layoutEngine";
import { Process } from "interfaces/generated";
import { drawGraphEdges } from "./drawGraphEdges";
import { drawGraphNodes } from "./drawGraphNodes";
import * as PIXI from "pixi.js";

/**
 * Adds the project-cards to our canvas
 * @param viewport
 * @param project
 * @param userCanEdit
 * @param dispatch
 * @param setSelectedObject
 * @param vsmObjectMutation
 */
export function addCardsToCanvas(
  viewport: Viewport,
  process: Process,
  userCanEdit: boolean,
  dispatch,
  setSelectedObject,
  vsmObjectMutation
): void {
  // Adding cards to canvas
  const root = process.objects ? process.objects[0] : null;
  if (!root) {
    const card = assetFactory(
      {
        vsmObjectID: 0,
        name: "ERROR: Project contains no root object",
      },
      setSelectedObject
    );
    viewport.addChild(card);
  } else {
    const graph = new Graph(process);
    const { nodes, edges } = graph;

    drawGraphNodes(nodes, setSelectedObject, viewport);
    drawGraphEdges(edges, viewport);

    // add a user-cursor to the canvas
    const cursor = new PIXI.Graphics();
    cursor.beginFill(0x000000, 0.5);
    cursor.drawCircle(0, 0, 10);
    cursor.endFill();
    viewport.addChild(cursor);
    cursor.visible = false;

    // add a highlight circle
    const highlight = new PIXI.Graphics();
    //dark blue
    highlight.beginFill(0x0000ff, 0.1);
    highlight.drawCircle(0, 0, 100);
    highlight.endFill();
    viewport.addChild(highlight);
    highlight.visible = false;

    const lastHitTest = null;
    //Track mouse positon and update cursor position, keeping scroll position in mind
    viewport.on("mousemove", (e) => {
      // make the cursor visible
      cursor.visible = true;
      const { x, y } = e.data.getLocalPosition(viewport);
      cursor.x = x;
      cursor.y = y;

      //If hover, show a tooltip
      // Do not hittest too often (performance)
      // if (Date.now() - lastHitTest > 200) {
      //   const hit = graph.hitTest(x, y);
      //   lastHitTest = Date.now();
      //   if (hit.node || hit.edge) {
      //     //Todo: Do something with the hit
      //     // console.log({ node: hit.node, edge: hit.edge, x, y });
      //     // graph.selectNode(hit.node);
      //   } else {
      //     // graph.deselectAllNodes();
      //   }
      // }
    });
    viewport.on("mouseout", () => {
      cursor.visible = false;
    });

    //Hittest the cursor against the nodes and edges
    viewport.on("pointerdown", (e) => {
      const { x, y } = e.data.getLocalPosition(viewport);
      const hit = graph.hitTest(x, y);
      if (hit?.node) {
        graph.selectNode(hit.node);
        // highligh the node

        const highlightDiameter =
          Math.max(hit.node.width, hit.node.height) * 1.5;

        highlight.width = highlightDiameter;
        highlight.height = highlightDiameter;

        highlight.x = hit.node.position.x + hit.node.width / 2;
        highlight.y = hit.node.position.y + hit.node.height / 2;
        highlight.visible = true;
      } else {
        graph.deselectAllNodes();
        highlight.visible = false;
      }
    });
  }
}
