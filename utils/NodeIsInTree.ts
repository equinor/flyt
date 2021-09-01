import { vsmObject } from "../interfaces/VsmObject";

/**
 * Check if a vsm-node is in a vsm-tree.
 *
 * Could probably do this in a better way, like short circuit when we find a match.
 * But it works and is not-super-expensive.
 *
 * @param node
 * @param tree
 */
export function nodeIsInTree(node: vsmObject, tree: vsmObject): boolean {
  const foundChild = [];
  const findNodeInTree = (node: vsmObject, tree: vsmObject) => {
    if (node.vsmObjectID === tree.vsmObjectID) foundChild.push(node);
    tree.childObjects?.forEach((child) => {
      findNodeInTree(node, child);
    });
  };
  findNodeInTree(node, tree);
  return foundChild.length > 0;
}
