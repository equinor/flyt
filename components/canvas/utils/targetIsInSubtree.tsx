import { Node } from "reactflow";
import { NodeData } from "@/types/NodeData";

export const targetIsInSubtree = (
  node: Node<NodeData>,
  targetId: string,
  nodes: Node<NodeData>[]
) => {
  for (let i = 0; i < node.data.children.length; i++) {
    const id = node.data.children[i];
    if (id === targetId) {
      return true;
    } else {
      const node = nodes.find((node) => node.id === id);
      if (node && targetIsInSubtree(node, targetId, nodes)) {
        return true;
      }
    }
  }
  return false;
};
