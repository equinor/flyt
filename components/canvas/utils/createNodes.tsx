import { NodeDataApi } from "@/types/NodeDataApi";
import { NodeTypes } from "@/types/NodeTypes";
import { getQIPRContainerWidth } from "./getQIPRContainerWidth";
import { Column, NodeDataCommon } from "@/types/NodeData";
import { Node } from "reactflow";
import { nodeValidityMap } from "./nodeValidityHelper";

const createNode = (
  node: NodeDataApi,
  nodes: NodeDataApi[],
  shapeSize: { height: number; width: number },
  userCanEdit: boolean,
  merging: boolean,
  mergeNode: { mutate: (args: { sourceId: string; targetId: string }) => void },
  handleClickNode: (id: string) => void,
  disabledNodeTypes?: NodeTypes[],
  parent: NodeDataApi | null = null,
  column: Column | null = null,
  tempNodes: Node<NodeDataCommon>[] = []
): Node[] => {
  if (!node) return tempNodes;

  if (parent) {
    if (
      [
        NodeTypes.mainActivity,
        NodeTypes.output,
        NodeTypes.supplier,
        NodeTypes.input,
        NodeTypes.customer,
      ].includes(node.type)
    ) {
      column = {
        id: node.id,
        firstNodeType: node.type,
      };
    }

    const duplicateNode = tempNodes.find((tempNode) => tempNode.id === node.id);

    if (duplicateNode) {
      const newData = duplicateNode.data;
      newData.parents?.push(parent.id);
      newData.parentTypes?.push(parent.type);
      tempNodes = tempNodes.map((tempNode) =>
        tempNode.id === node.id ? { ...tempNode, data: newData } : tempNode
      );
      return tempNodes;
    }

    tempNodes.push({
      id: node.id,
      data: {
        ...node,
        handleClickNode: () => handleClickNode(node.id),
        handleMerge: (sourceId, targetId) =>
          sourceId && targetId && mergeNode.mutate({ sourceId, targetId }),
        mergeable:
          node.children?.length === 0 || node.type === NodeTypes.choice,
        merging,
        deletable: nodeValidityMap[node.type].deletable,
        copyable: nodeValidityMap[node.type].copyable,
        parents: [parent.id],
        parentTypes: [parent.type],
        userCanEdit,
        column,
        shapeHeight: shapeSize.height,
        shapeWidth: shapeSize.width,
        disabled: disabledNodeTypes?.includes(node.type),
      },
      position: { x: 0, y: 0 },
      height: shapeSize.height,
      width: shapeSize.width + getQIPRContainerWidth(node.tasks),
      type: node.type,
      deletable: false,
    });
  } else {
    tempNodes.push({
      id: node.id,
      data: {
        ...node,
        deletable: nodeValidityMap[node.type].deletable,
        copyable: nodeValidityMap[node.type].copyable,
        parents: [],
        column,
        shapeHeight: shapeSize.height,
        shapeWidth: shapeSize.width,
      },
      position: { x: 0, y: 0 },
      height: shapeSize.height,
      width: shapeSize.width + getQIPRContainerWidth(node.tasks),
      type: node.type,
      deletable: false,
    });
  }

  node.children?.forEach((childId) => {
    const childNode = nodes.find((node) => node.id === childId);
    childNode &&
      createNode(
        childNode,
        nodes,
        shapeSize,
        userCanEdit,
        merging,
        mergeNode,
        handleClickNode,
        disabledNodeTypes,
        node,
        column,
        tempNodes
      );
  });

  return tempNodes;
};

export const createNodes = (
  apiNodes: NodeDataApi[],
  shapeSize: { height: number; width: number },
  userCanEdit: boolean,
  merging: boolean,
  mergeNode: { mutate: (args: { sourceId: string; targetId: string }) => void },
  handleClickNode: (id: string) => void,
  disabledNodeTypes: NodeTypes[] = []
) => {
  const root = apiNodes.find(
    (node: NodeDataApi) => node.type === NodeTypes.root
  );

  if (!root) {
    return [];
  }

  return createNode(
    root,
    apiNodes,
    shapeSize,
    userCanEdit,
    merging,
    mergeNode,
    handleClickNode,
    disabledNodeTypes
  );
};
