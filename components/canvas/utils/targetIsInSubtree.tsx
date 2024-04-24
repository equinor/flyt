import { Node } from "reactflow";
import { NodeData } from "@/types/NodeData";

export const targetIsInSubtree = (
  node: Node<NodeData>,
  target: Node<NodeData>,
  nodes: Node<NodeData>[],
  visited = new Set()
) => {
  if (node.data.columnId !== target.data.columnId) return false;
  if (visited.has(node.id)) return false;

  visited.add(node.id);

  if (node.data.children.includes(target.id)) {
    return true;
  }

  for (const childId of node.data.children) {
    const childNode = nodes.find((n) => n.id === childId);
    if (childNode && targetIsInSubtree(childNode, target, nodes, visited)) {
      return true;
    }
  }

  return false;
};
