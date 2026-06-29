import { NodeDataApi } from "@/types/NodeDataApi";
import { NodeTypes } from "@/types/NodeTypes";
import { getQIPRContainerWidth } from "./getQIPRContainerWidth";
import { Column, NodeDataCommon } from "@/types/NodeData";
import { Node } from "reactflow";
import { nodeValidityMap } from "./nodeValidityHelper";
import { CardAccess } from "@/types/CardAccess";

const getNextNodeType = (currentNodeType: NodeTypes) => {
  switch (currentNodeType) {
    case NodeTypes.output:
      return NodeTypes.customer;
    case NodeTypes.customer:
      return NodeTypes.input;
    case NodeTypes.input:
      return NodeTypes.supplier;
    case NodeTypes.supplier:
      return NodeTypes.mainActivity;
    default:
      return NodeTypes.mainActivity;
  }
};

const createNode = (
  node: NodeDataApi,
  nodes: NodeDataApi[],
  shapeSize: { height: number; width: number },
  userCanEdit: boolean,
  userEditCardStatus: CardAccess[],
  merging: boolean,
  mergeNode: { mutate: (args: { sourceId: string; targetId: string }) => void },
  handleClickNode: (id?: string, isDeselect?: boolean) => void,
  handleNodeDelete: (id: string) => void,
  handleTooltipOnAccessRemove: () => void,
  disabledNodeTypes?: NodeTypes[],
  parent: NodeDataApi | null = null,
  column: Column | null = null,
  tempNodes: Node<NodeDataCommon>[] = []
): Node[] => {
  if (!node) return tempNodes;
  let handleNextClick: (isSkipGuiding: boolean) => void = () => {};
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
      handleNextClick = (isSkipGuiding: boolean) => {
        if (isSkipGuiding) {
          handleClickNode(undefined, true);
          return;
        }
        const nextNodeType: NodeTypes = getNextNodeType(node.type);
        const nextNodeId = nodes.find(
          (node: NodeDataApi) => node.type === nextNodeType
        )?.id;
        handleClickNode(nextNodeId);
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
        handleNextClick: (isSkipGuiding: boolean) =>
          handleNextClick(isSkipGuiding),
        handleNodeDelete: () => handleNodeDelete(node.id),
        handleTooltipOnAccessRemove: () => handleTooltipOnAccessRemove(),
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
        userEditCardStatus,
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
        userEditCardStatus,
        merging,
        mergeNode,
        handleClickNode,
        handleNodeDelete,
        handleTooltipOnAccessRemove,
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
  userEditCardStatus: CardAccess[],
  merging: boolean,
  mergeNode: { mutate: (args: { sourceId: string; targetId: string }) => void },
  handleClickNode: (id?: string, isDeselect?: boolean) => void,
  handleNodeDelete: (id: string) => void,
  disabledNodeTypes: NodeTypes[] = [],
  handleTooltipOnAccessRemove: () => void
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
    userEditCardStatus,
    merging,
    mergeNode,
    handleClickNode,
    handleNodeDelete,
    handleTooltipOnAccessRemove,
    disabledNodeTypes
  );
};
