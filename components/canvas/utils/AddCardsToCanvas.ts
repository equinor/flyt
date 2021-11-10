import { Viewport } from "pixi-viewport";
import { recursiveTree } from "./recursiveTree";
import { RecursiveState } from "easy-peasy";
import { vsmProject } from "../../../interfaces/VsmProject";
import { assetFactory } from "./AssetFactory";
import { createGraph, Graph } from "utils/layoutEngine";
import { Process } from "interfaces/generated";
import { vsmObject } from "interfaces/VsmObject";
import { vsmObjectTypes } from "types/vsmObjectTypes";
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
    nodes.forEach((node) => {
      if (!node.hidden) {
        const card = assetFactory(
          {
            vsmObjectID: node.id,
            name: node.name,
            vsmObjectType: { pkObjectType: node.type },
            tasks: node.tasks,
          } as vsmObject,
          setSelectedObject
        );
        viewport.addChild(card);
        card.x = node.position.x;
        card.y = node.position.y;
      }
    });

    edges.forEach((edge) => {
      if (!edge.hidden) {
        //Draw a line between the two nodes
        const line = new PIXI.Graphics();
        line.lineStyle(1, 0x888888, 1);
        line.moveTo(edge.position.start.x, edge.position.start.y);
        line.lineTo(edge.position.end.x, edge.position.end.y);
        viewport.addChild(line);
      }
    });
    // viewport.addChild(
    //   recursiveTree(
    //     root,
    //     0,
    //     userCanEdit,
    //     dispatch,
    //     setSelectedObject,
    //     vsmObjectMutation
    //   )
    // );
  }
}
