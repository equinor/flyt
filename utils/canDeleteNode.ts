import { NodeTypes } from "../types/NodeTypes";
import { NodeDataApi } from "../types/NodeDataApi";

export const canDeleteNode = (vsmObject: NodeDataApi): boolean => {
  if (!vsmObject || !vsmObject.type) return false;
  const { type } = vsmObject;
  return (
    type === NodeTypes.mainActivity ||
    type === NodeTypes.subActivity ||
    type === NodeTypes.waiting ||
    type === NodeTypes.choice
  );
};
