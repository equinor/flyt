import { NodeData, NodeDataFull } from "types/NodeData";
import { NodeTypes } from "types/NodeTypes";
import { Node } from "reactflow";
import { targetIsInSubtree } from "./targetIsInSubtree";

export const validTarget = (
  source: Node<NodeData> | undefined,
  target: Node<NodeData> | undefined,
  nodes: Node<NodeDataFull>[],
  isDragAndDrop = true
): boolean => {
  if (!target || !source) return false;
  const sourceType = source.type;
  const targetType = target.type;

  if (isDragAndDrop) {
    const targetIsParent = source?.data?.parents?.includes(target.id);

    if (targetIsParent) {
      return false;
    }

    if (
      sourceType === NodeTypes.choice &&
      (target.data.children.length || targetIsInSubtree(source, target, nodes))
    ) {
      return false;
    }
  }

  if (
    !(
      ((sourceType === NodeTypes.choice ||
        sourceType === NodeTypes.subActivity ||
        sourceType === NodeTypes.waiting) &&
        (targetType === NodeTypes.choice ||
          targetType === NodeTypes.subActivity ||
          targetType === NodeTypes.waiting ||
          targetType === NodeTypes.mainActivity)) ||
      (sourceType === NodeTypes.mainActivity &&
        targetType === NodeTypes.mainActivity)
    )
  ) {
    return false;
  }

  return true;
};
