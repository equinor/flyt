import { vsmObject } from "../../../interfaces/VsmObject";
import { GraphNode } from "../../layoutEngine";

// Traverses the object and it's children and returns a graph node for each object it can find.
export function createNodes(objects: vsmObject[]): GraphNode[] {
  const nodes: GraphNode[] = [];
  objects.forEach((object) => {
    const node: GraphNode = {
      id: object.vsmObjectID,
      name: object.name,
      type: object.vsmObjectType.pkObjectType,
    };
    if (object.childObjects) nodes.push(...createNodes(object.childObjects));
    nodes.push(node);
  });
  return nodes;
}
