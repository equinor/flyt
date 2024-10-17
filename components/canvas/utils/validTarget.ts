import { NodeDataFull, NodeDataCommon } from "types/NodeData";
import { NodeTypes } from "types/NodeTypes";
import { Node } from "reactflow";
import { targetIsInSubtree } from "./targetIsInSubtree";
import { getNodeValidPositions } from "./nodeValidityHelper";

export const validTarget = (
  source: Node<NodeDataCommon> | undefined,
  target: Node<NodeDataCommon> | undefined,
  nodes: Node<NodeDataFull>[],
  isDragAndDrop = true
): boolean => {
  if (!target || !source) return false;
  const sourceType = source.type as NodeTypes;

  if (isDragAndDrop) {
    const targetIsParent = source?.data?.parents?.includes(target.id);
    if (targetIsParent) {
      return false;
    }

    const targetIsInChoiceSubtree =
      sourceType === NodeTypes.choice &&
      (target.data.children.length || targetIsInSubtree(source, target, nodes));
    if (targetIsInChoiceSubtree) {
      return false;
    }
  }

  const targetsValidPositions = getNodeValidPositions(target);

  return !!targetsValidPositions?.bottom?.includes(sourceType);
};
