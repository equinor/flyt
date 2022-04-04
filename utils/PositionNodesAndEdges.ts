import { GraphNode, GraphEdge } from "./layoutEngine";
import { calculateEdgePositions as positionEdges } from "./calculateEdgePositions";
import { positionNodes } from "./positionNodes";

/**
 * Place all nodes and edges in the graph on a x,y grid.
 * @param graph The graph to traverse, containing nodes and edges.
 */
export function positionNodesAndEdges(graph: {
  nodes: GraphNode[];
  edges: GraphEdge[];
}): void {
  // Position the nodes
  positionNodes(graph);
  // Position the edges
  positionEdges(graph);
}
