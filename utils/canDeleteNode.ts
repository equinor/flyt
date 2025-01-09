import { NodeTypes } from "../types/NodeTypes";
import { NodeDataCommon } from "../types/NodeData";

export const canDeleteNode = (node: NodeDataCommon): boolean => {
  if (!node || !node.type) return false;
  const { type } = node;
  return (
    type === NodeTypes.mainActivity ||
    type === NodeTypes.subActivity ||
    type === NodeTypes.waiting ||
    type === NodeTypes.choice ||
    type === NodeTypes.linkedProcess
  );
};
