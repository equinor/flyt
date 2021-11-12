import { GraphNode } from "./layoutEngine";

export function getTouchingNodes(
  nodes: GraphNode[],
  node: GraphNode
): GraphNode[] {
  //Todo: accomodate for the whole width of the node (include the task-side-sheet)
  const touchingNodes: GraphNode[] = [];
  nodes.map((n) => {
    if (
      n.position.x + n.width > node.position.x &&
      n.position.x < node.position.x + node.width &&
      n.position.y + n.height > node.position.y &&
      n.position.y < node.position.y + node.height
    ) {
      touchingNodes.push(n);
    }
  });
  return touchingNodes;
}
