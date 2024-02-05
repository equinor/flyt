import { NodeTypes } from "../types/NodeTypes";

export const getNodeTypeName = (type: NodeTypes): string => {
  switch (type) {
    case NodeTypes.root:
      return "Process";
    case NodeTypes.supplier:
      return "Supplier";
    case NodeTypes.input:
      return "Input";
    case NodeTypes.mainActivity:
      return "Main Activity";
    case NodeTypes.subActivity:
      return "Sub Activity";
    case NodeTypes.text:
      return "Text";
    case NodeTypes.waiting:
      return "Waiting";
    case NodeTypes.output:
      return "Output";
    case NodeTypes.customer:
      return "Customer";
    case NodeTypes.choice:
      return "Choice";
    default:
      return type;
  }
};
