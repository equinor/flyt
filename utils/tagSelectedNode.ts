import { Node } from "@xyflow/react";

/**
 * Make sure selected node has `selected` set to `true`
 */
export const tagSelectedNode = <T extends Record<string, unknown>>(
  nodes: Node<T>[],
  id: string | undefined
) => {
  if (id) {
    const targetNode = nodes.find((node) => node.id === id);
    if (targetNode) targetNode.selected = true;
  }
};
