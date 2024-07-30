import { NodeTypes } from "@/types/NodeTypes";

export const getNodeHelperText = (type: NodeTypes) => {
  switch (type) {
    case NodeTypes.supplier:
      return "4. Who or what supplies the Input? List the Supplier(s) (e.g. collaborators, data systems, plans, requirements)";
    case NodeTypes.input:
      return "3. What triggers you to begin the process? List the Input(s), (eg. information, materials, tools, a weekly meeting)";
    case NodeTypes.output:
      return "1. What are the key deliverables or results of the process? List the Output(s).";
    case NodeTypes.customer:
      return "2. Which role or system recieves the Output? List the Customer(s).";
    default:
      return undefined;
  }
};
