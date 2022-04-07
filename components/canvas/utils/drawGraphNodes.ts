import { Viewport } from "pixi-viewport";
import { assetFactory } from "./AssetFactory";
import { GraphNode } from "utils/layoutEngine";
import { vsmObject } from "interfaces/VsmObject";

export function drawGraphNodes(
  nodes: GraphNode[],
  setSelectedObject: any,
  viewport: Viewport
): void {
  console.info("drawGraphNodes");
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
}
