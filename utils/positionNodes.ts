import { Graph, GraphEdge, GraphNode, choiceGroupTypes } from "./layoutEngine";
import { defaultNodeHeight, defaultNodeWidth, padding } from "./createGraph";

import { getAllConnectedNodesFromNodeToLeafNode } from "./getAllConnectedNodesFromNodeToLeafNode";
import { groupBy } from "./groupBy";
import { vsmObjectTypes } from "types/vsmObjectTypes";

export function positionNodes(graph: {
  nodes: GraphNode[];
  edges: GraphEdge[];
}): void {
  // put all nodes out on the board in a grid
  const firstNode = graph.nodes[0];
  firstNode.position = {
    x: 0,
    y: 0,
  };
  console.log(
    `First node is placed, x: ${firstNode.position.x}, y: ${firstNode.position.y}`,
    graph.nodes
  );

  const nodesGroupedByLevel = [[firstNode]]; // first level is just the first node
  groupNodesByLevel(firstNode);

  // traverse the graph from the first node and add the nodes to the correct level
  function groupNodesByLevel(selectedNode, level = 1) {
    const outgoingEdges = graph.edges.filter(
      (edge) => edge.from === selectedNode.id
    );
    outgoingEdges.forEach((edge) => {
      const toNode = graph.nodes.find((node) => node.id === edge.to);
      if (!toNode) throw new Error("Could not find toNode. Dangling edge?");

      if (!nodesGroupedByLevel[level]) nodesGroupedByLevel[level] = []; // create new level if it doesn't exist
      if (!nodesGroupedByLevel[level].includes(toNode))
        nodesGroupedByLevel[level].push(toNode); // add node to level

      groupNodesByLevel(toNode, level + 1);
    });
  }

  const cellWidth = 170; // width of each grid cell
  const cellHeight = 170; // height of each grid cell

  // placing nodes in a grid
  placeNodesInAGrid(nodesGroupedByLevel, cellWidth, cellHeight, graph);

  // const levelsSortedByLength = nodesGroupedByLevel.sort((a, b) => {
  //   return a.length - b.length;
  // });
  // const longestLevel = levelsSortedByLength[levelsSortedByLength.length - 1];
  // // The longest level will define the length of the graph
  // // So we should readjust the position of the nodes going out of the longest level

  // longestLevel.forEach((node) => {
  //   const connectedNodes = getAllConnectedNodesFromNodeToLeafNode(node, graph);
  //   connectedNodes.forEach((connectedNode) => {
  //     connectedNode.position = {
  //       x: node.position.x,
  //       y: connectedNode.position.y,
  //     }
  //   });
  // });

  // const indexOfLongestLevel = nodesGroupedByLevel.indexOf(longestLevel);
  traverseAndAdjustPlacement(nodesGroupedByLevel, graph);

  // console.log({ levelsSortedByLength, longestLevel });
  // position the edges
  positionEdges(graph);

  placeNodesWithNoEdges(graph, cellWidth, cellHeight);
}

export const getPathsFromNodeToLeafNode = (
  node: GraphNode,
  graph: { nodes: any; edges: any }
): GraphNode[][] => {
  const paths = [];
  getPathToLeafNode(node);
  // for each node, walk the graph and find the path to the leaf node
  function getPathToLeafNode(node: GraphNode, path = []): void {
    const outgoingEdges = graph.edges.filter((edge) => edge.from === node.id);
    if (outgoingEdges.length === 0) {
      paths.push([...path, node]);
      return;
    }
    outgoingEdges.forEach((edge) => {
      const toNode = graph.nodes.find((node) => node.id === edge.to);
      if (!toNode) throw new Error("Could not find toNode. Dangling edge?");
      getPathToLeafNode(toNode, [...path, node]);
    });
  }
  return paths;
};
/**
 * Place nodes that have no edges
 * @param graph
 * @param cellWidth
 * @param cellHeight
 */
function placeNodesWithNoEdges(
  graph: { nodes: GraphNode[]; edges: GraphEdge[] },
  cellWidth: number,
  cellHeight: number
) {
  graph.nodes
    .filter((n) => !n.position)
    .forEach((node, index) => {
      node.position = {
        x: index * cellWidth,
        y: -cellHeight - padding,
      };
      node.name = `Node ${node.id} is not connected to anything`;
      node.type = vsmObjectTypes.error;
    });
}

function positionEdges(graph: { nodes: GraphNode[]; edges: GraphEdge[] }) {
  graph.edges.forEach((edge) => {
    const fromNode = graph.nodes.find((node) => node.id === edge.from);
    const toNode = graph.nodes.find((node) => node.id === edge.to);
    if (!fromNode || !toNode)
      throw new Error("Could not find fromNode or toNode. Dangling edge?");

    if (!fromNode.position)
      throw new Error(`fromNode ${fromNode.id} is not positioned`);
    if (!toNode.position)
      throw new Error(`toNode ${toNode.id} is not positioned`);

    // edge.position = { start: null, end: null };
    // edge.position.start = {
    //   x: fromNode.position.x,
    //   y: fromNode.position.y,
    // };
    // edge.position.end = {
    //   x: toNode.position.x,
    //   y: toNode.position.y,
    // };

    edge.position = {
      start: {
        x: fromNode.position.x + fromNode.width / 2,
        y: fromNode.position.y + fromNode.height,
      },
      end: {
        x: toNode.position.x + toNode.width / 2,
        y: toNode.position.y,
      },
    };
  });
}

/**
 * Move a node
 * @param node - the node to move
 * @param edges - edges in the graph. (or just the connected edges)
 * @param position - the new position
 */
function moveNode(
  node: GraphNode,
  edges: GraphEdge[],
  position: { x: number; y: number }
): void {
  node.position = position;

  // Whenever we move a node, we need to re-calculate the positions of all the edges that are connected to it
  edges.forEach((edge) => {
    if (edge.to === node.id) {
      edge.position.end = position;
    }
    if (edge.from === node.id) {
      // move outgoing edge start position
      edge.position.start = { x: position.x, y: position.y + node.height };
    }
  });
}

function placeNodesInAGrid(
  nodesGroupedByLevel: GraphNode[][],
  cellWidth: number,
  cellHeight: number,
  graph: { nodes: GraphNode[]; edges: GraphEdge[] }
) {
  nodesGroupedByLevel.forEach((nodes, level) => {
    console.log(`Level ${level}`);
    nodes.forEach((node, index) => {
      console.log(
        `Placing node ${node.id} (${index + 1} out of ${nodes.length})`
      );
      // const incomingEdges = graph.edges.filter(
      //   (edge) => edge.to === node.id
      // );
      // const connectedNodes = incomingEdges.map((edge) => {
      //   return graph.nodes.find((node) => node.id === edge.from);
      // });
      // // const medianX = calculateMedianX(connectedNodes);
      // console.log({ medianX });
      // if (node.position) {
      // console.log(`${node.id} is already positioned`); // already positioned once
      // } else {
      node.position = {
        x: index * cellWidth,
        y: level * cellHeight,
      };
    });
  });
}
function traverseAndAdjustPlacement(nodesGroupedByLevel: GraphNode[][], graph) {
  // nodesGroupedByLevel.forEach((nodes, level) => {
  //   const paths = nodes.map((node) => ({ node, paths: getPathsFromNodeToLeafNode(node, graph) }));
  //   console.log(`Level ${level}`, paths);
  // });

  nodesGroupedByLevel[0].forEach((node) => {
    console.log(`Node ${node.id}`);
    const paths = getPathsFromNodeToLeafNode(node, graph);
    console.log({ paths });
  });
}

function calculateMedianX(nodes: GraphNode[]) {
  return (
    nodes.reduce((acc, node) => {
      return acc + node?.position?.x;
    }, 0) / nodes.length
  );
}
