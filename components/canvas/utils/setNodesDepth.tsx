import { NodeDataFull } from "@/types/NodeData";
import { NodeTypes } from "@/types/NodeTypes";
import { Node } from "reactflow";

type MergedNode = [Node<NodeDataFull>, number];
type MergedNodesMap = Map<string, MergedNode>;

const setSingleNodeDepth = (
  nodeId: string,
  nodes: Node<NodeDataFull>[],
  parentDepth: number,
  mergedNodesLooping: MergedNodesMap,
  mergedNodesReady: Node<NodeDataFull>[]
) => {
  const node = nodes.find((node) => node.id === nodeId);
  if (!node) return;
  const { data } = node;

  if (data?.parents?.length > 1) {
    if (mergedNodesLooping.has(nodeId)) {
      const nodeDuplicate = mergedNodesLooping.get(nodeId)![0];
      const loopCount = mergedNodesLooping.get(nodeId)![1];
      if (nodeDuplicate.data.depth && nodeDuplicate.data.depth <= parentDepth) {
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
      if (data.depth)
        setSingleNodeDepth(
          child,
          nodes,
          data.depth,
          mergedNodesLooping,
          mergedNodesReady
        );
    });
  }
};

export const setNodesDepth = (nodes: Node<NodeDataFull>[]) => {
  const mergedNodesLooping: MergedNodesMap = new Map();
  let mergedNodesReady: Node<NodeDataFull>[] = [];

  const rootNode = nodes.find((node) => node.type === NodeTypes.root);
  rootNode?.data.children.forEach((childId) => {
    setSingleNodeDepth(childId, nodes, 0, mergedNodesLooping, mergedNodesReady);
  });

  while (mergedNodesReady.length > 0) {
    const dupeMergedNodesReady = mergedNodesReady;
    mergedNodesReady = [];
    dupeMergedNodesReady.forEach((node) => {
      node.data.children.forEach((child) => {
        if (node.data.depth)
          setSingleNodeDepth(
            child,
            nodes,
            node.data.depth,
            mergedNodesLooping,
            mergedNodesReady
          );
      });
    });
  }
  return nodes;
};
