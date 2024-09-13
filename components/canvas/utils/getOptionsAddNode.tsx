import { NodeData } from "@/types/NodeData";
import { NodeTypes } from "@/types/NodeTypes";
import { Node } from "reactflow";

const optionsMatrix = {
  [NodeTypes.root]: {},
  [NodeTypes.supplier]: {},
  [NodeTypes.input]: {
    right: [NodeTypes.mainActivity],
  },
  [NodeTypes.output]: {
    left: [NodeTypes.mainActivity],
  },
  [NodeTypes.customer]: {},
  [NodeTypes.mainActivity]: {
    bottom: [NodeTypes.subActivity, NodeTypes.choice, NodeTypes.waiting],
    left: [NodeTypes.mainActivity],
    right: [NodeTypes.mainActivity],
  },
  [NodeTypes.subActivity]: {
    bottom: [NodeTypes.subActivity, NodeTypes.choice, NodeTypes.waiting],
  },
  [NodeTypes.waiting]: {
    bottom: [NodeTypes.subActivity, NodeTypes.choice, NodeTypes.waiting],
  },
  [NodeTypes.choice]: {
    bottom: [NodeTypes.subActivity, NodeTypes.choice, NodeTypes.waiting],
  },
  [NodeTypes.text]: {},
  [NodeTypes.hidden]: {},
};

export const getOptionsAddNode = (node: Node<NodeData>) => {
  const { type, isChoiceChild } = node.data;
  let options = optionsMatrix[type];

  if (isChoiceChild) {
    options = {
      ...options,
      left: [NodeTypes.subActivity, NodeTypes.choice, NodeTypes.waiting],
      right: [NodeTypes.subActivity, NodeTypes.choice, NodeTypes.waiting],
    };
  }

  return options;
};
