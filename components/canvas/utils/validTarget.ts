import { NodeData } from "types/NodeData";
import { NodeTypes } from "types/NodeTypes";
import { Node } from "reactflow";
import { targetIsInSubtree } from "./targetIsInSubtree";

export const validTarget = (
  source: Node<NodeData> | undefined,
  target: Node<NodeData> | undefined,
  nodes: Node<NodeData>[]
): boolean => {
  if (!target || !source) return false;
  const sourceType = source.type;
  const targetType = target.type;
  const targetIsParent = source?.data?.parents?.find((id) => id === target.id);
  const targetIsChoiceChild =
    sourceType === NodeTypes.choice &&
    target?.data?.parents?.find((id) => id === source.id);

  if (
    sourceType === NodeTypes.choice &&
    (target.data.children.length || targetIsInSubtree(source, target.id, nodes))
  ) {
    return false;
  }

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
