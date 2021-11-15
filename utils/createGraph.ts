import { ChildObjectsEntity, Process } from "interfaces/generated";
import { vsmObjectTypes } from "types/vsmObjectTypes";
import { GraphNode, GraphEdge, choiceGroupTypes } from "./layoutEngine";
import { calculateTaskSectionWidth } from "./calculateTaskSectionWidth";
import { getTouchingNodes } from "./getTouchingNodes";
import { PositionNodesAndEdges } from "./PositionNodesAndEdges";
import { AddNodesAndEdges } from "./AddNodesAndEdges";

export const defaultNodeWidth = 126;
export const defaultNodeHeight = 136;
export const padding = 25; //Padding between the cards
// create a graph of nodes and edges
export function createGraph(process: Process): {
  nodes: Array<GraphNode>;
  edges: Array<GraphEdge>;
} {
  const graph = {
    nodes: Array<GraphNode>(),
    edges: Array<GraphEdge>(),
  };

  // add nodes and edges to the graph
  AddNodesAndEdges(process, graph);

  //Calculate positions for the nodes and edges.
  PositionNodesAndEdges(graph);

  return graph;
}
