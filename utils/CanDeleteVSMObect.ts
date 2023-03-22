import { vsmObjectTypes } from "../types/vsmObjectTypes";
import { vsmObject } from "../interfaces/VsmObject";

export const canDeleteVSMObject = (vsmObject: vsmObject): boolean => {
  if (!vsmObject || !vsmObject.type) return false;
  const { type } = vsmObject;
  return (
    type === vsmObjectTypes.mainActivity ||
    type === vsmObjectTypes.subActivity ||
    type === vsmObjectTypes.waiting ||
    type === vsmObjectTypes.choice
  );
};
