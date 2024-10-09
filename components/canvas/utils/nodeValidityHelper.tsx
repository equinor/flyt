import { NodeData } from "@/types/NodeData";
import { NodeTypes } from "@/types/NodeTypes";
import { Node, Position } from "reactflow";

type NodeValidity = {
  validPositions: {
    [key in Position]?: NodeTypes[];
  };
  copyable: boolean;
  deletable: boolean;
};

type NodeValidityMap = {
  [key in NodeTypes]: NodeValidity;
};

export const nodeValidityMap: NodeValidityMap = {
  [NodeTypes.root]: {
    validPositions: {},
    copyable: false,
    deletable: false,
  },
  [NodeTypes.supplier]: {
    validPositions: {},
    copyable: false,
    deletable: false,
  },
  [NodeTypes.input]: {
    validPositions: {
      [Position.Right]: [NodeTypes.mainActivity],
    },
    copyable: false,
    deletable: false,
  },
  [NodeTypes.output]: {
    validPositions: {
      [Position.Left]: [NodeTypes.mainActivity],
    },
    copyable: false,
    deletable: false,
  },
  [NodeTypes.customer]: {
    validPositions: {},
    copyable: false,
    deletable: false,
  },
  [NodeTypes.mainActivity]: {
    validPositions: {
      [Position.Bottom]: [
        NodeTypes.subActivity,
        NodeTypes.choice,
        NodeTypes.waiting,
      ],
      [Position.Left]: [NodeTypes.mainActivity],
      [Position.Right]: [NodeTypes.mainActivity],
    },
    copyable: true,
    deletable: true,
  },
  [NodeTypes.subActivity]: {
    validPositions: {
      [Position.Bottom]: [
        NodeTypes.subActivity,
        NodeTypes.choice,
        NodeTypes.waiting,
      ],
    },
    copyable: true,
    deletable: true,
  },
  [NodeTypes.waiting]: {
    validPositions: {
      [Position.Bottom]: [
        NodeTypes.subActivity,
        NodeTypes.choice,
        NodeTypes.waiting,
      ],
    },
    copyable: true,
    deletable: true,
  },
  [NodeTypes.choice]: {
    validPositions: {
      [Position.Bottom]: [
        NodeTypes.subActivity,
        NodeTypes.choice,
        NodeTypes.waiting,
      ],
    },
    copyable: true,
    deletable: true,
  },
  [NodeTypes.hidden]: {
    validPositions: {},
    copyable: false,
    deletable: false,
  },
};

export const getOptionsAddNode = (node: Node<NodeData>) => {
  const { type, isChoiceChild } = node.data;
  let validPositions = nodeValidityMap[type].validPositions;

  if (isChoiceChild) {
    validPositions = {
      ...validPositions,
      left: [NodeTypes.subActivity, NodeTypes.choice, NodeTypes.waiting],
      right: [NodeTypes.subActivity, NodeTypes.choice, NodeTypes.waiting],
    };
  }

  return Object.entries(validPositions) as [Position, NodeTypes[]][];
};
