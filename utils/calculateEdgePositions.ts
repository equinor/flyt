import { defaultNodeWidth } from "./createGraph";
import { GraphNode, GraphEdge } from "./layoutEngine";

export function calculateEdgePositions(graph: {
  nodes: GraphNode[];
  edges: GraphEdge[];
}): void {
  graph.edges.forEach((edge) => {
    const fromNode = graph.nodes.find(
      (node) => node.id === edge.from
    ) as GraphNode;
    const toNode = graph.nodes.find((node) => node.id === edge.to) as GraphNode;
    if (!fromNode || !toNode) {
      return;
    }
    edge.position = {
      start: {
        x: fromNode.position.x + defaultNodeWidth / 2,
        y: fromNode.position.y + fromNode.height / 2,
      },
      end: {
        x: toNode.position.x + defaultNodeWidth / 2,
        y: toNode.position.y,
      },
    };
  });
}
