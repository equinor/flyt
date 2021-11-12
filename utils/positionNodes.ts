import { vsmObjectTypes } from "types/vsmObjectTypes";
import { GraphNode, GraphEdge, choiceGroupTypes } from "./layoutEngine";
import { groupBy } from "./groupBy";
import { getAllConnectedNodesFromNodeToLeafNode } from "./getAllConnectedNodesFromNodeToLeafNode";
import { defaultNodeWidth, padding, defaultnodeHeight } from "./createGraph";

export function positionNodes(graph: {
  nodes: GraphNode[];
  edges: GraphEdge[];
}): void {
  const nodesByLevel = groupBy(graph.nodes, "level");

  //traverse through level 1 and place each card in a column
  Object.keys(nodesByLevel).forEach((level) => {
    const nodes = nodesByLevel[level];
    if (level === "1") {
      nodes.forEach((node: GraphNode, index: number) => {
        node.position = {
          x: index * (defaultNodeWidth + padding),
          y: Number(level) * defaultnodeHeight, //We use the default node height for the level height so that it is always the same height
        };
      });
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
      // throw new Error("fromNode position is not set");
    }
    if (!(toNode.position?.x || toNode.position?.y)) {
      // We generally want to place the to node under the from node
      // -> If the to node has no position, set it to the position of the from node adding the height of the from node

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
        } else if (toNode.choiceGroup === choiceGroupTypes.Center) {
          const maxY = Math.max(
            fromNode.position.y + fromNode.height + padding,
            toNode.position.y + toNode.height + padding
          );
          toNode.position = {
            x: fromNode.position.x,
            y: maxY + fromNode.height + padding,
          };

          // edge.hidden = true;
        }
      }

      //Todo: improve this
      // but if the toNode is wider than the fromNode, we want to take the fromNode's width into account
      // if (toNode.width > fromNode.width) {
      //   toNode.position.x += fromNode.width / 2 - toNode.width / 2;
      // }
    }
  });

  // const level1Nodes = nodesByLevel["1"];
  // level1Nodes.forEach((node: GraphNode) => {
  //   const connectedNodes = getAllConnectedNodesFromNodeToLeafNode(graph, node);

  //   //find the leftmost node
  //   const leftmostNode = connectedNodes.reduce(
  //     (leftmostNode, connectedNode) => {
  //       if (connectedNode.position.x < leftmostNode.position.x) {
  //         return connectedNode;
  //       }
  //       return leftmostNode;
  //     },
  //     node
  //   );
  //   //find the rigthmost node
  //   const rightmostNode = connectedNodes.reduce(
  //     (rightmostNode, connectedNode) => {
  //       if (connectedNode.position.x > rightmostNode.position.x) {
  //         return connectedNode;
  //       }
  //       return rightmostNode;
  //     },
  //     node
  //   );
  //   //Todo: Improve this. Doesn't work in all cases. Example process/674 in production
  //   //Calculate the width we need for all the connected nodes
  //   const width =
  //     rightmostNode.position.x + rightmostNode.width - leftmostNode.position.x;
  //   //for all nodes that are to the right of the rightmost node, we need to move them to the right
  //   graph.nodes.forEach((node) => {
  //     if (node.position?.x > rightmostNode.position?.x) {
  //       node.position.x += Math.ceil(width / 2);
  //     }
  //   });
  // });
}
