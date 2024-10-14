import { NodeDataCommon } from "@/types/NodeData";
import { NodeTypes } from "@/types/NodeTypes";
import { Node, Position } from "reactflow";
import { isChoiceChild } from "./nodeRelationsHelper";

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
      [Position.Bottom]: [NodeTypes.linkedProcess],
      [Position.Right]: [NodeTypes.mainActivity],
    },
    copyable: false,
    deletable: false,
  },
  [NodeTypes.output]: {
    validPositions: {
      [Position.Bottom]: [NodeTypes.linkedProcess],
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
  [NodeTypes.linkedProcess]: {
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

export const getOptionsAddNode = (node: Node<NodeDataCommon>) => {
  const { type, parentTypes } = node.data;
  let validPositions = nodeValidityMap[type].validPositions;

  if (isChoiceChild(parentTypes)) {
    validPositions = {
      ...validPositions,
      /*
      TODO: Add this back in when the order of choice children has been fixed
      left: [NodeTypes.subActivity, NodeTypes.choice, NodeTypes.waiting],
      */
      right: [NodeTypes.subActivity, NodeTypes.choice, NodeTypes.waiting],
    };
  }

  return Object.entries(validPositions) as [Position, NodeTypes[]][];
};
