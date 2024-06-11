import { NodeTypes } from "@/types/NodeTypes";
import { uid } from "@/utils/uuid";
import { NodeDataFull } from "@/types/NodeData";
import { Node, Edge } from "reactflow";

export const createHiddenNodes = (
  tempNodes: Node<NodeDataFull>[],
  tempEdges: Edge[],
  shapeSize: { width: number; height: number }
) => {
  const hiddenNodes: Node<NodeDataFull>[] = [];
  tempNodes.forEach((node) => {
    if (!node.data.parents || node.data.parents.length <= 1) {
      return;
    }

    const depthDeepestNode = findDepthDeepestNode(node, tempNodes);
    if (!depthDeepestNode) {
      return;
    }

    node.data.parents.forEach((parentNodeId) => {
      const tempParentNode = tempNodes.find((node) => node.id === parentNodeId);
      if (
        !tempParentNode.data.depth ||
        tempParentNode.data.depth >= depthDeepestNode
      ) {
        return;
      }

      // Find and filter the edge we are replacing with hidden node
      let originalEdge = null;
      tempEdges = tempEdges.reduce((newEdges, edge) => {
        if (edge.source === tempParentNode.id && edge.target === node.id) {
          if (!originalEdge) {
            originalEdge = edge;
          }
          return newEdges;
        }
        newEdges.push(edge);
        return newEdges;
      }, []);

      // Add all new hidden nodes and edges
      let tempParentNodeId = tempParentNode.id;
      for (let i = tempParentNode.data.depth; i < depthDeepestNode; i++) {
        const id = uid();
        hiddenNodes.push(createHiddenNode(id, tempParentNode, i, shapeSize));

        tempParentNode.type === NodeTypes.choice &&
        i === tempParentNode.data.depth
          ? tempEdges.push(createChoiceEdge(originalEdge, tempParentNodeId, id))
          : tempEdges.push(createNormalEdge(tempParentNodeId, id));

        tempEdges.push(createStraightEdge(id));
        tempParentNodeId = id;
      }
      tempEdges.push(createNormalEdge(tempParentNodeId, node.id));
    });
  });
  tempNodes = tempNodes.concat(hiddenNodes);
  return { tempNodes, tempEdges };
};

// Util function to get the depth of the deepest node parent of the current node iterated over
const findDepthDeepestNode = (
  node: Node<NodeDataFull>,
  tempNodes: Node<NodeDataFull>[]
) => {
  let depthDeepestNode: undefined | number = undefined;
  node.data.parents.forEach((parentNodeId) => {
    const parentNode = tempNodes.find((node) => node.id === parentNodeId);
    if (
      parentNode?.data?.depth &&
      (!depthDeepestNode || parentNode?.data?.depth > depthDeepestNode)
    )
      depthDeepestNode = parentNode.data.depth;
  });
  return depthDeepestNode;
};

// Below are Helper functions for creating the different nodes and edges

const createHiddenNode = (
  id: string,
  parentNode: Node<NodeDataFull>,
  depth: number,
  shapeSize: { height: number; width: number }
) => ({
  id,
  data: {
    parents: [parentNode.id],
    columnId: parentNode.data.columnId,
    depth: depth,
    children: [],
    shapeHeight: shapeSize.height,
    shapeWidth: shapeSize.width,
  },
  position: { x: 0, y: 0 },
  type: NodeTypes.hidden,
  height: shapeSize.height,
  width: shapeSize.width,
  draggable: false,
  selectable: false,
});

const createNormalEdge = (parentId: string, id: string) => ({
  id: `${parentId}=>${id}`,
  source: parentId,
  target: id,
});

const createStraightEdge = (id: string) => ({
  id: `${id}=>${id}`,
  source: id,
  target: id,
  type: "straight",
});

const createChoiceEdge = (edge: Edge, sourceId: string, targetId: string) => ({
  id: edge.id,
  source: sourceId,
  target: targetId,
  type: "choice",
  label: edge.label,
});
