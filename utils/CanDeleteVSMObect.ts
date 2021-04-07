import { vsmObjectTypes } from "../types/vsmObjectTypes";
import { vsmObject } from "../interfaces/VsmObject";

export const canDeleteVSMObject = (vsmObject: vsmObject): boolean => {
  if (!vsmObject) return false;
  switch (vsmObject.vsmObjectType.pkObjectType) {
    case vsmObjectTypes.process:
      return false;
    case vsmObjectTypes.supplier:
      return false;
    case vsmObjectTypes.input:
      return false;
    case vsmObjectTypes.mainActivity:
      return true;
    case vsmObjectTypes.subActivity:
      return true;
    case vsmObjectTypes.text:
      return false;
    case vsmObjectTypes.waiting:
      return true;
    case vsmObjectTypes.output:
      return false;
    case vsmObjectTypes.customer:
      return false;
    case vsmObjectTypes.choice:
      return true;
    default:
      return false;
  }
};
