import { Node } from "reactflow";
import { NodeData } from "@/types/NodeData";

export const targetIsSubtreeLeaf = (
  node: Node<NodeData>,
  nodes: Node<NodeData>[],
  targetId: string
) => {
  for (let i = 0; i < node.data.children.length; i++) {
    const id = node.data.children[i];
    if (id === targetId) {
      return true;
    } else {
      const node = nodes.find((node) => node.id === id);
      if (node && targetIsSubtreeLeaf(node, nodes, targetId)) {
        return true;
      }
    }
  }
  return false;
};
