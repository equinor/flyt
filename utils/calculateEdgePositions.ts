import { defaultNodeWidth } from "./createGraph";
import { GraphEdge, GraphNode } from "./layoutEngine";

export function calculateEdgePositions(graph: {
  nodes: GraphNode[];
  edges: GraphEdge[];
}): void {
  graph.edges.forEach((edge) => {
    const fromNode = getGraphNode(graph, edge.from);
    if (!fromNode) throw new Error(`Edge from node ${edge.from} not found`);

    const toNode = getGraphNode(graph, edge.to);
    if (!toNode) throw new Error(`Edge to node ${edge.to} not found`);

    edge.position = {
      start: {
        x: fromNode.position.x + defaultNodeWidth / 2,
        y: fromNode.position.y + fromNode.height - 12,
      },
      end: {
        x: toNode.position.x + defaultNodeWidth / 2,
        y: toNode.position.y,
      },
    };
  });
}

// Helper function to get a graph node by id
export function getGraphNode(
  graph: { nodes: GraphNode[]; edges: GraphEdge[] },
  nodeId: number
): GraphNode | undefined {
  return graph.nodes.find((node) => node.id === nodeId);
}
