import { NodeTypes } from "@/types/NodeTypes";
import { Node, Position } from "reactflow";
import { NodeDataApi } from "@/types/NodeDataApi";

const createNode = (
  node: NodeDataApi,
  shapeSize: { height: number; width: number },
  isHorizontalFlow: boolean
): Node => {
  const { height, width } = shapeSize;
  return {
    id: node.id,
    data: {
      ...node,
      shapeHeight: height,
      shapeWidth: width,
    },
    position: { x: 0, y: 0 },
    height: height,
    width: width,
    type: NodeTypes.project,
    deletable: false,
    sourcePosition: isHorizontalFlow ? Position.Right : undefined,
    targetPosition: isHorizontalFlow ? Position.Left : undefined,
    selected: node.id === node.projectId,
  };
};

export const createProcessHierarchyNodes = (
  apiNodes: NodeDataApi[],
  shapeSize: { height: number; width: number },
  isHorizontalFlow: boolean
) => apiNodes.map((n) => createNode(n, shapeSize, isHorizontalFlow));
