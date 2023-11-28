import { NodeDataFull } from "types/NodeData";
import { NodeTypes } from "types/NodeTypes";
import { Node } from "reactflow";

export const validDropTarget = (
  source: Node<NodeDataFull> | undefined,
  target: Node<NodeDataFull> | undefined
): boolean => {
  if (!target || !source) return false;
  const sourceType = source.type;
  const targetType = target.type;
  const targetIsParent = source?.data?.parents?.find((id) => id === target.id);
  const targetIsChoiceChild =
    sourceType === NodeTypes.choice &&
    target?.data?.parents?.find((id) => id === source.id);

  return (
    !targetIsParent &&
    !targetIsChoiceChild &&
    (((sourceType === NodeTypes.choice ||
      sourceType === NodeTypes.subActivity ||
      sourceType === NodeTypes.waiting) &&
      (targetType === NodeTypes.choice ||
        targetType === NodeTypes.subActivity ||
        targetType === NodeTypes.waiting ||
        targetType === NodeTypes.mainActivity)) ||
      (sourceType === NodeTypes.mainActivity &&
        targetType === NodeTypes.mainActivity))
  );
};
