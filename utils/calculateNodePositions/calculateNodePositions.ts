// Every card has a position on the board.
// This function calculates the position of each card.
// Note, the position of a card is determined by the relation of the card to the other cards.
// So we need to start with the first card and calculate the position of the next cards.
// We might need to re-adjust the position of the cards.
// Graph = {nodes,edges}

// Position rules:
// 1. The first card is centered above its children.
// 2. The children should be placed under the parent card and not overlap.

// The first card can be found by looking for a card of type process.
// The first card is the root of the graph.
import { ParsedProcess } from "../processParser/processParser.test";
import { vsmObjectTypes } from "../../types/vsmObjectTypes";
import { calculateCardWidth } from "../cardWidthCalculator/cardWidthCalculator";

export function calculateNodePositions(parsedProcess: ParsedProcess) {
  const { nodes, edges } = parsedProcess;
  const rootNode = nodes.find((node) => node.type === vsmObjectTypes.process);
  if (!rootNode) {
    throw new Error("No root node found");
  }
  const padding = 16;
  rootNode.position = { x: 0, y: 0 };
  rootNode.width = calculateCardWidth(rootNode.tasks, rootNode.type);
  rootNode.height = 136;
  rootNode.width = calculateCardWidth(rootNode.tasks, rootNode.type);
  const outGoingEdges = edges.filter((edge) => edge.from === rootNode.id);
  const children = outGoingEdges.map((edge) =>
    nodes.find((node) => node.id === edge.to)
  );
  children.forEach((child, index, array) => {
    child.width = calculateCardWidth(child.tasks, child.type);
    child.height = 136;
    if (!index) {
      child.position = {
        x: rootNode.position.x,
        y: rootNode.position.y + rootNode.height + padding,
      };
    } else {
      const previousChild = array[index - 1];
      child.position = {
        x: previousChild.position.x + previousChild.width + padding,
        y: previousChild.position.y,
      };
      //  re-position the parent
      const firstChild = array[0];
      rootNode.position = {
        x:
          (firstChild.position.x +
            child.position.x +
            (child.width - rootNode.width)) /
          2,
        y: rootNode.position.y,
      };
    }
  });
  return nodes;
}
