import { EdgeTypes } from "@/types/EdgeTypes";
import { NodeDataFull } from "@/types/NodeData";
import { NodeTypes } from "@/types/NodeTypes";
import { Edge, Node, XYPosition } from "@xyflow/react";

export type CanvasEdgeData = {
  points?: XYPosition[];
  hiddenNodeTree?: string[];
  setIsEditingText?: (isEditing: boolean) => void;
  userCanEdit?: boolean;
  writable?: boolean;
  onDelete?: () => void;
  hovered?: boolean;
};

const isWritable = (edge: Edge<CanvasEdgeData>, nodes: Node[]) => {
  const sourceNode = nodes.find((n) => n.id === edge.source);
  return sourceNode?.type === NodeTypes.choice;
};

const isDeletable = (
  edge: Edge<CanvasEdgeData>,
  edges: Edge<CanvasEdgeData>[]
) => edges.find((e) => e.target === edge.target && e.id !== edge.id);

const createLongEdges = (
  nodes: Node<NodeDataFull>[],
  longEdges: Edge<CanvasEdgeData>[],
  shapeSize: { height: number; width: number }
) =>
  longEdges.map((e) => {
    const points: XYPosition[] = [];
    e.data?.hiddenNodeTree?.forEach((nId: string) => {
      const hiddenNode = nodes.find((n) => n.id === nId);
      if (hiddenNode) {
        points.push({
          x: hiddenNode.position.x + shapeSize.width / 2,
          y: hiddenNode.position.y,
        });
        points.push({
          x: hiddenNode.position.x + shapeSize.width / 2,
          y: hiddenNode.position.y + shapeSize.height,
        });
      }
    });
    e.data = {
      ...e.data,
      points,
    };
    return e;
  });

export const createEdges = (
  nodes: Node<NodeDataFull>[],
  edges: Edge<CanvasEdgeData>[],
  longEdges: Edge<CanvasEdgeData>[],
  shapeSize: { height: number; width: number },
  userCanEdit: boolean,
  setIsEditingEdgeText: (arg1: boolean) => void,
  setEdgeToBeDeletedId: (arg1: string) => void
): Edge<CanvasEdgeData>[] => {
  longEdges = createLongEdges(nodes, longEdges, shapeSize);
  edges = edges.concat(longEdges);
  return edges.map((e) => ({
    ...e,
    type: EdgeTypes.custom,
    deletable: false,
    interactionWidth: 50,
    data: {
      ...e?.data,
      setIsEditingText: (arg1: boolean) => setIsEditingEdgeText(arg1),
      userCanEdit: userCanEdit,
      writable: isWritable(e, nodes),
      onDelete: isDeletable(e, edges)
        ? () => setEdgeToBeDeletedId(e.id)
        : undefined,
    },
  }));
};
