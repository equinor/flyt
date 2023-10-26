import { NodeDataFull } from "types/NodeData";
import { vsmObjectTypes } from "types/vsmObjectTypes";
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
    sourceType === vsmObjectTypes.choice &&
    target?.data?.parents?.find((id) => id === source.id);

  return (
    !targetIsParent &&
    !targetIsChoiceChild &&
    (((sourceType === vsmObjectTypes.choice ||
      sourceType === vsmObjectTypes.subActivity ||
      sourceType === vsmObjectTypes.waiting) &&
      (targetType === vsmObjectTypes.choice ||
        targetType === vsmObjectTypes.subActivity ||
        targetType === vsmObjectTypes.waiting ||
        targetType === vsmObjectTypes.mainActivity)) ||
      (sourceType === vsmObjectTypes.mainActivity &&
        targetType === vsmObjectTypes.mainActivity))
  );
};
