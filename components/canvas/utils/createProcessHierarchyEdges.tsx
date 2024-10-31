import { NodeDataCommon } from "@/types/NodeData";
import { uid } from "@/utils/uuid";
import { Edge, MarkerType, Node } from "reactflow";

export const createProcessHierarchyEdges = (
  nodes: Node<NodeDataCommon>[],
  color = "#5C5C5C"
): Edge[] => {
  return nodes.flatMap(({ id, data: { children } }) =>
    children.map((childId) => ({
      id: uid(),
      deletable: false,
      interactionWidth: 50,
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color,
      },
      style: {
        strokeWidth: 2,
        stroke: color,
      },
      source: id,
      target: childId,
    }))
  );
};
