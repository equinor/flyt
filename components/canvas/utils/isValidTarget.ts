import { NodeDataFull, NodeDataCommon } from "types/NodeData";
import { NodeTypes } from "types/NodeTypes";
import { Node } from "@xyflow/react";
import { targetIsInSubtree } from "./targetIsInSubtree";
import { getNodeValidPositions } from "./nodeValidityHelper";

export const isValidTarget = (
  source: Node<NodeDataFull> | undefined,
  target: Node<NodeDataFull> | undefined,
  nodes: Node<NodeDataFull>[],
  isDragAndDrop = true
): boolean => {
  if (!target || !source) return false;
  const sourceNode = source as Node<NodeDataCommon>;
  const targetNode = target as Node<NodeDataCommon>;
  const sourceType = sourceNode.type as NodeTypes;

  if (isDragAndDrop) {
    const targetIsParent = sourceNode?.data?.parents?.includes(targetNode.id);
    if (targetIsParent) {
      return false;
    }

    const targetIsInChoiceSubtree =
      sourceType === NodeTypes.choice &&
      (targetNode.data.children.length ||
        targetIsInSubtree(sourceNode, targetNode, nodes));
    if (targetIsInChoiceSubtree) {
      return false;
    }
  }

  const targetsValidPositions = getNodeValidPositions(targetNode);

  return !!targetsValidPositions?.bottom?.includes(sourceType);
};
