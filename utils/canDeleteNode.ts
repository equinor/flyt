import { NodeTypes } from "../types/NodeTypes";
import { NodeData } from "../types/NodeData";

export const canDeleteNode = (vsmObject: NodeData): boolean => {
  if (!vsmObject || !vsmObject.type) return false;
  const { type } = vsmObject;
  return (
    type === NodeTypes.mainActivity ||
    type === NodeTypes.subActivity ||
    type === NodeTypes.waiting ||
    type === NodeTypes.choice
  );
};
