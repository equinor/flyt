import { Node } from "reactflow";

/**
 * Make sure selected node has `selected` set to `true`
 */
export const tagSelectedNode = <T, U>(
  nodes: Node<T>[],
  selectedNode: Node<U> | undefined
) => {
  if (selectedNode) {
    const targetNode = nodes.find((node) => node.id === selectedNode.id);
    if (targetNode) targetNode.selected = true;
  }
};
