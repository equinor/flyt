import { Node } from "reactflow";
import { NodeDataFull } from "types/NodeData";

const mergedNodesLooping = new Map<string, [Node<NodeDataFull>, number]>();
let mergedNodesReady: Node<NodeDataFull>[] = [];

const setSingleNodeDepth = (
  nodeId: string,
  nodes: Node<NodeDataFull>[],
  parentDepth: number
) => {
  const node = nodes.find((node) => node.id === nodeId);
  if (!node) return;
  const { data } = node;

  if (data?.parents?.length > 1) {
    if (mergedNodesLooping.has(nodeId)) {
      const nodeDuplicate = mergedNodesLooping.get(nodeId)![0];
      const loopCount = mergedNodesLooping.get(nodeId)![1];
      if (
        nodeDuplicate?.data?.depth &&
        nodeDuplicate.data.depth <= parentDepth
      ) {
        nodeDuplicate.data.depth = parentDepth + 1;
      }
      mergedNodesLooping.set(nodeId, [nodeDuplicate, loopCount + 1]);
      if (nodeDuplicate?.data?.parents?.length === loopCount + 1) {
        mergedNodesReady.push(nodeDuplicate);
        mergedNodesLooping.delete(nodeId);
      }
    } else {
      mergedNodesLooping.set(nodeId, [node, 1]);
      data.depth = parentDepth + 1;
    }
  } else {
    data.depth = parentDepth + 1;
    data?.children?.forEach((child) => {
      if (data.depth) setSingleNodeDepth(child, nodes, data.depth);
    });
  }
};

export const setNodesDepth = (nodes: Node<NodeDataFull>[]) => {
  const rootNode = nodes.find((node) => node.type === "Root");
  rootNode?.data.children.forEach((childId) => {
    setSingleNodeDepth(childId, nodes, 0);
  });
  while (mergedNodesReady.length > 0) {
    const dupeMergedNodesReady = mergedNodesReady;
    mergedNodesReady = [];
    dupeMergedNodesReady.forEach((node) => {
      node.data.children.forEach((child) => {
        if (node.data.depth) setSingleNodeDepth(child, nodes, node.data.depth);
      });
    });
  }
};
