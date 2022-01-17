import { GraphEdge, GraphNode, choiceGroupTypes } from "./layoutEngine";
import { defaultNodeHeight, defaultNodeWidth, padding } from "./createGraph";

import { getAllConnectedNodesFromNodeToLeafNode } from "./getAllConnectedNodesFromNodeToLeafNode";
import { groupBy } from "./groupBy";
import { vsmObjectTypes } from "types/vsmObjectTypes";

export function positionNodes(graph: {
  nodes: GraphNode[];
  edges: GraphEdge[];
}): void {
  console.log("positionNodes");
  const nodesByLevel = groupBy(graph.nodes, "level");

  // traverse through level 1 and place each card in a column
  Object.keys(nodesByLevel).forEach((level) => {
    const nodes = nodesByLevel[level];
    if (level === "1") {
      nodes.forEach((node: GraphNode, index: number) => {
        node.position = {
          x: index * (defaultNodeWidth + padding),
          y: Number(level) * defaultNodeHeight, //We use the default node height for the level height so that it is always the same height
        };
      });
      //Traverse down the tree and find the width of this node
      // nodes.forEach((node: GraphNode) => {
      //   const connectedNodes = getAllConnectedNodesFromNodeToLeafNode(
      //     node,
      //     graph
      //   );
      //   const connectedNodesWidth = connectedNodes.reduce(
      //     (acc, node) => acc + node.width,
      //     0
      //   );
      //   // node.position.x = node.position.x +  connectedNodesWidth + padding * connectedNodes.length;
      // });
    }
  });
  // traverse through the edges and calculate the positions for the missing nodes
  graph.edges.forEach((edge) => {
    const fromNode = graph.nodes.find((node) => node.id === edge.from);
    const toNode = graph.nodes.find((node) => node.id === edge.to);

    if (!fromNode || !toNode) {
      throw new Error(
        `No node found for edge ${edge.from} -> ${edge.to}.
        (From node ${fromNode?.id} -> To node ${toNode?.id})

        That means that we have an edge that is created, but we have forgotten to add the node for it.
        Check that you have added the nodes to the graph.`
      );
    }

    if (!(fromNode.position?.x || fromNode.position?.y)) {
      fromNode.position = {
        x: 0,
        y: 0,
      };
      fromNode.name = `Troublemaker`;
      // throw new Error("fromNode position is not set");
    }
    if (!(toNode.position?.x || toNode.position?.y)) {
      // We generally want to place the to node under the from node
      // -> If the to node has no position, set it to the position of the from node adding the height of the from node

      const { x, y } = fromNode.position;
      if (!x && !y) {
        // toNode.name = "Lost sheep";
        toNode.notPositionedCorrectly = true;
        //Note, all children will also need to be set to not positioned correctly
      }
      if (fromNode.notPositionedCorrectly) {
        toNode.notPositionedCorrectly = true;
      }
      toNode.position = {
        x: fromNode.position.x,
        y: fromNode.position.y + fromNode.height + padding,
      };

      // unless the noNode is a child of a choice node,
      // in which case we want to move it left or right
      if (fromNode.type === vsmObjectTypes.choice) {
        if (toNode.choiceGroup === choiceGroupTypes.Left) {
          toNode.position = {
            x: fromNode.position.x - toNode.width / 2 - padding,
            y: fromNode.position.y + fromNode.height + padding,
          };
        } else if (toNode.choiceGroup === choiceGroupTypes.Right) {
          toNode.position = {
            x: fromNode.position.x + toNode.width / 2 + padding,
            y: fromNode.position.y + fromNode.height + padding,
          };
        }
      }
    }
  });

  // go through all the nodes and calculate the position of the nodes that are not positioned correctly
  graph.nodes
    .filter((node) => node.notPositionedCorrectly)
    .forEach((node) => {
      const fromEdge = graph.edges.filter((edge) => edge.to === node.id);
      const fromNodes = fromEdge.map((edge) =>
        graph.nodes.find((node) => node.id === edge.from)
      );
      // Find the difference and center the next card in the middle of the from nodes
      const fromNodeXPositionDifference =
        fromNodes.reduce((difference, node) => {
          return difference + node.position.x;
        }, 0) / fromNodes.length;

      const fromNode = graph.nodes.find((node) => node.id === fromEdge[0].from);
      node.position = {
        x: fromNodeXPositionDifference,
        y: fromNode.position.y + fromNode.height + padding,
      };

      node.notPositionedCorrectly = undefined;
    });
  //    // We still might have some overlapping sub-trees
  // // For every sub-tree, we want to move it to the right...?

  // //We can identify a sub-tree, whenever we find a node that has multiple edges going out of it

  // // We want to find all the nodes that have multiple edges going out of them
  // //find all edges with multiple to-nodes

  // const visitedNodes = [];
  // const nodesWithMultipleEdges = {};
  // graph.edges.forEach((edge) => {
  //   if (visitedNodes.includes(edge.from)) {
  //     const node = graph.nodes.find((node) => node.id === edge.from);
  //     if (!nodesWithMultipleEdges[edge.from]) {
  //       nodesWithMultipleEdges[edge.from] = node;
  //     }
  //   } else {
  //     visitedNodes.push(edge.from);
  //   }
  // });
  // Object.keys(nodesWithMultipleEdges).forEach((key) => {
  //   const node = nodesWithMultipleEdges[key];
  //   node.name = "MULTIPLE OUTGOING EDGES";
  //   const nodes = getAllConnectedNodesFromNodeToLeafNode(graph, node);
  // });
  graph.nodes.forEach((node) => {
    //check if the node is colliding with another node
    graph.nodes.forEach((otherNode) => {
      if (
        node.id !== otherNode.id &&
        node.position.x + node.width > otherNode.position.x &&
        node.position.x < otherNode.position.x + otherNode.width &&
        node.position.y + node.height > otherNode.position.y &&
        node.position.y < otherNode.position.y + otherNode.height
      ) {
        // node.name = "COLLIDING";
        // otherNode.name = "COLLIDING";
        //overlapping distance
        const overlap = Math.min(
          node.position.x + node.width - otherNode.position.x,
          otherNode.position.x + otherNode.width - node.position.x
        );
        otherNode.position.x = otherNode.position.x + overlap + padding;
      }
    });
  });
}

export function positionNodesBeta(graph: {
  nodes: GraphNode[];
  edges: GraphEdge[];
}): void {
  // // set default positions for nodes
  // graph.nodes.forEach((node) => {
  //   if (!node.position) {
  //     node.position = {
  //       x: 0,
  //       y: 0,
  //     };
  //   }
  // });

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
  placeNodesInAGrid(nodesGroupedByLevel, cellWidth, cellHeight);

  // // for each edge out from the first node, find the path to the leaf node
  // const firstNodeEdges = graph.edges.filter(
  //   (edge) => edge.from === firstNode.id
  // );

  // firstNodeEdges.forEach((edge) => {
  //   const toNode = graph.nodes.find((node) => node.id === edge.to);
  //   if (!toNode) throw new Error("Could not find toNode. Dangling edge?");
  //   const paths = getPathsFromNodeToLeafNode(toNode, graph);
  //   console.log(`Paths from node ${toNode.id} to the leaf node`, paths);

  //   // find the node that is furthest right
  //   const lastPath = paths[paths.length - 1];
  //   let maxX = 0;
  //   lastPath.forEach((node) => {
  //     if (node.position && node.position.x > maxX) maxX = node.position.x;
  //   });
  //   console.log({ maxX })
  // });

  // const paths = getPathsFromNodeToLeafNode(firstNode, graph);
  // console.log({ paths })

  // if a node has multiple edges going into it, place it in the middle of the edges
  // graph.nodes.forEach((node) => {
  //   const incomingEdges = graph.edges.filter(
  //     (edge) => edge.to === node.id
  //   );
  //   if (incomingEdges.length > 1) {
  //     const x = incomingEdges.reduce((acc, edge) => {
  //       const fromNode = graph.nodes.find((node) => node.id === edge.from);
  //       if (!fromNode) throw new Error("Could not find fromNode. Dangling edge?");
  //       return acc + fromNode.position.x;
  //     }, 0);
  //     console.log(`${node.id} has multiple incoming edges`, x);
  //     node.position.x = x / incomingEdges.length;
  //   } else {
  //     if (incomingEdges && incomingEdges.length === 1) {
  //       const fromNode = graph.nodes.find((node) => node.id === incomingEdges[0].from);
  //       const siblings = graph.edges.filter((edge) => edge.from === fromNode.id);
  //       if (siblings) {
  //         const numberOfSiblings = siblings.length;
  //         console.log(`${node.id} has ${numberOfSiblings} siblings`);
  //       } else {
  //         node.position.x = fromNode.position.x;
  //       }
  //     }
  //   }
  // });

  // position the edges
  positionEdges(graph);

  // const pathStrings = paths.map((path) => {
  //   return path.map((node) => node.id).join(" -> ");
  // });
  // console.log(pathStrings);

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
  cellHeight: number
) {
  nodesGroupedByLevel.forEach((nodes, level) => {
    console.log(`Level ${level}`);
    nodes.forEach((node, index) => {
      console.log(
        `Placing node ${node.id} (${index + 1} out of ${nodes.length})`
      );
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
