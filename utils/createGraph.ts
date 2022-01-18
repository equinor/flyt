import { ChildObjectsEntity, Process } from "interfaces/generated";
import { GraphEdge, GraphNode, choiceGroupTypes } from "./layoutEngine";

import { AddNodesAndEdges } from "./AddNodesAndEdges";
import { PositionNodesAndEdges } from "./PositionNodesAndEdges";
import { calculateTaskSectionWidth } from "./calculateTaskSectionWidth";
import { getTouchingNodes } from "./getTouchingNodes";
import { positionNodes } from "./positionNodes";
import { vsmObjectTypes } from "types/vsmObjectTypes";

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

export function mockProcessGraph(process): {
  nodes: Array<GraphNode>;
  edges: Array<GraphEdge>;
} {
  console.log("mockProcessGraph");

  const graph = {
    nodes: Array<GraphNode>(),
    edges: Array<GraphEdge>(),
  };
  // add nodes 1 through 4
  for (let i = 1; i <= 20; i++) {
    graph.nodes.push({
      id: i,
      type: vsmObjectTypes.subActivity,
      selected: false,
      name: `${i}`,
      width: defaultNodeWidth,
      height: defaultNodeHeight,
      // hidden: i === 1,
    } as GraphNode);
  }

  // // 1 -> 2,3 -> 4
  // graph.edges.push({
  //   from: 1,
  //   to: 2,
  // });
  // graph.edges.push({
  //   from: 1,
  //   to: 3,
  // });
  // graph.edges.push({
  //   from: 2,
  //   to: 4,
  // });
  // graph.edges.push({
  //   from: 3,
  //   to: 4,
  // });

  //  1-> 2,3
  graph.edges.push({
    from: 1,
    to: 2,
    // hidden: true,
  });
  graph.edges.push({
    from: 1,
    to: 3,
    // hidden: true,
  });
  // 2-> 4,5 -> 8
  graph.edges.push({
    from: 2,
    to: 4,
  });
  graph.edges.push({
    from: 2,
    to: 5,
  });
  // 3-> 6,7 -> 8
  graph.edges.push({
    from: 3,
    to: 6,
  });
  graph.edges.push({
    from: 3,
    to: 7,
  });
  graph.edges.push({
    from: 4,
    to: 8,
  });
  graph.edges.push({
    from: 5,
    to: 8,
  });
  graph.edges.push({
    from: 6,
    to: 8,
  });
  graph.edges.push({
    from: 7,
    to: 8,
  });

  //1 -> 9 -> 10->11
  graph.edges.push({
    from: 1,
    to: 9,
    // // hidden: true,
  });
  graph.edges.push({
    from: 9,
    to: 10,
  });
  graph.edges.push({
    from: 10,
    to: 11,
  });

  // 8 -> 14,15
  graph.edges.push({
    from: 8,
    to: 14,
  });
  graph.edges.push({
    from: 8,
    to: 15,
  });

  // 14,15 -> 12
  graph.edges.push({
    from: 14,
    to: 12,
  });
  graph.edges.push({
    from: 15,
    to: 12,
  });

  // 11 -> 13
  graph.edges.push({
    from: 11,
    to: 13,
  });

  // 13 -> 16
  graph.edges.push({
    from: 13,
    to: 16,
  });

  // 16 -> 12
  graph.edges.push({
    from: 16,
    to: 12,
  });

  positionNodes(graph);

  return graph;
}
