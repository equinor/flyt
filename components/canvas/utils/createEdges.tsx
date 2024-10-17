import { EdgeTypes } from "@/types/EdgeTypes";
import { NodeDataFull } from "@/types/NodeData";
import { NodeTypes } from "@/types/NodeTypes";
import { Edge, Node, XYPosition } from "reactflow";

const isWritable = (edge: Edge, nodes: Node[]) => {
  const sourceNode = nodes.find((n) => n.id === edge.source);
  return sourceNode?.type === NodeTypes.choice;
};

const isDeletable = (edge: Edge, edges: Edge[]) =>
  edges.find((e) => e.target === edge.target && e.id !== edge.id);

const createLongEdges = (
  nodes: Node<NodeDataFull>[],
  longEdges: Edge[],
  shapeSize: { height: number; width: number }
) =>
  longEdges.map((e) => {
    const points: XYPosition[] = [];
    e.data?.hiddenNodeTree.forEach((nId: string) => {
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
    e.data.points = points;
    return e;
  });

export const createEdges = (
  nodes: Node<NodeDataFull>[],
  edges: Edge[],
  longEdges: Edge[],
  shapeSize: { height: number; width: number },
  userCanEdit: boolean,
  setIsEditingEdgeText: (arg1: boolean) => void,
  setEdgeToBeDeletedId: (arg1: string) => void
) => {
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
      onDelete: isDeletable(e, edges) && (() => setEdgeToBeDeletedId(e.id)),
    },
  }));
};
