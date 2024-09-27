import { NodeData } from "@/types/NodeData";
import { NodeTypes } from "@/types/NodeTypes";
import { Node, Position } from "reactflow";

type OptionsMatrix = {
  [key in NodeTypes]: {
    [key in Position]?: NodeTypes[];
  };
};

const optionsMatrix: OptionsMatrix = {
  [NodeTypes.root]: {},
  [NodeTypes.supplier]: {},
  [NodeTypes.input]: {
    [Position.Right]: [NodeTypes.mainActivity],
  },
  [NodeTypes.output]: {
    [Position.Left]: [NodeTypes.mainActivity],
  },
  [NodeTypes.customer]: {},
  [NodeTypes.mainActivity]: {
    [Position.Bottom]: [
      NodeTypes.subActivity,
      NodeTypes.choice,
      NodeTypes.waiting,
    ],
    [Position.Left]: [NodeTypes.mainActivity],
    [Position.Right]: [NodeTypes.mainActivity],
  },
  [NodeTypes.subActivity]: {
    [Position.Bottom]: [
      NodeTypes.subActivity,
      NodeTypes.choice,
      NodeTypes.waiting,
    ],
  },
  [NodeTypes.waiting]: {
    [Position.Bottom]: [
      NodeTypes.subActivity,
      NodeTypes.choice,
      NodeTypes.waiting,
    ],
  },
  [NodeTypes.choice]: {
    [Position.Bottom]: [
      NodeTypes.subActivity,
      NodeTypes.choice,
      NodeTypes.waiting,
    ],
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

  return Object.entries(options) as [Position, NodeTypes[]][];
};
