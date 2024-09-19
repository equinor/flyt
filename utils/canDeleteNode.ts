import { NodeTypes } from "../types/NodeTypes";
import { NodeDataInteractable } from "../types/NodeData";

export const canDeleteNode = (vsmObject: NodeDataInteractable): boolean => {
  if (!vsmObject || !vsmObject.type) return false;
  const { type } = vsmObject;
  return (
    type === NodeTypes.mainActivity ||
    type === NodeTypes.subActivity ||
    type === NodeTypes.waiting ||
    type === NodeTypes.choice
  );
};
