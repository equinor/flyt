import { NodeData, NodeDataFull } from "@/types/NodeData";
import { NodeTypes } from "@/types/NodeTypes";
import { Position, Node } from "reactflow";
import { isValidTarget } from "./isValidTarget";
import { NodeDataApiRequestBody } from "@/types/NodeDataApi";
import { getNodeTypeName } from "@/utils/getNodeTypeName";

export const handlePasteNode = (
  source: Node<NodeData>,
  target: Node<NodeData> | undefined,
  nodes: Node<NodeDataFull, string | undefined>[],
  addNode: (
    parentId: string,
    data: NodeDataApiRequestBody,
    position: Position
  ) => void
) => {
  const sourceType = getNodeTypeName(source.data.type);
  const targetType = getNodeTypeName(target?.data.type);

  if (!target?.id) {
    throw new Error(
      "Unable to paste: Hover a card before attempting to paste ⛔"
    );
  }
  if (isValidTarget(source, target, nodes, false)) {
    addNode(
      target.id,
      source.data,
      source.type === NodeTypes.mainActivity ? Position.Right : Position.Bottom
    );
  } else {
    throw new Error(
      `Unable to paste: ${sourceType} card is not allowed below ${targetType} card ⛔`
    );
  }
};
