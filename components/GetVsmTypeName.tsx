import { vsmObjectTypes } from "../types/vsmObjectTypes";

export function getVsmTypeName(
  type:
    | vsmObjectTypes.process
    | vsmObjectTypes.supplier
    | vsmObjectTypes.input
    | vsmObjectTypes.subActivity
    | vsmObjectTypes.text
    | vsmObjectTypes.waiting
    | vsmObjectTypes.output
    | vsmObjectTypes.customer
    | vsmObjectTypes.choice
): string {
  switch (type) {
    case vsmObjectTypes.process:
      return "process";
    case vsmObjectTypes.supplier:
      return "supplier";
    case vsmObjectTypes.input:
      return "input";
    case vsmObjectTypes.subActivity:
      return "subActivity";
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
  }
}
