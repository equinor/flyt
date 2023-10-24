import { vsmObjectTypes } from "../types/vsmObjectTypes";

export const getVsmTypeName = (type: vsmObjectTypes): string => {
  switch (type) {
    case vsmObjectTypes.root:
      return "process";
    case vsmObjectTypes.supplier:
      return "supplier";
    case vsmObjectTypes.input:
      return "input";
    case vsmObjectTypes.mainActivity:
      return "main activity";
    case vsmObjectTypes.subActivity:
      return "sub activity";
    case vsmObjectTypes.text:
      return "text";
    case vsmObjectTypes.waiting:
      return "waiting";
    case vsmObjectTypes.output:
      return "output";
    case vsmObjectTypes.customer:
      return "customer";
    case vsmObjectTypes.choice:
      return "choice";
    default:
      return "unknown";
  }
};
