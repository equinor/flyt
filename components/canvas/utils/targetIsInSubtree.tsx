import { Node } from "reactflow";
import { NodeData } from "@/types/NodeData";

export const targetIsInSubtree = (
  node: Node<NodeData>,
  target: Node<NodeData>,
  nodes: Node<NodeData>[],
  originalNodeId?: string
) => {
  if (node.data.columnId !== target.data.columnId) return false;
  if (originalNodeId !== node.id) {
    // Prevents infinite loops
    for (let i = 0; i < node.data.children.length; i++) {
      const id = node.data.children[i];
      if (id === target.id) {
        return true;
      } else {
        const nextNode = nodes.find((node) => node.id === id);
        if (nextNode && targetIsInSubtree(nextNode, target, nodes, node.id)) {
          return true;
        }
      }
    }
    return false;
  }
};
