import { GraphNode, GraphEdge } from "./layoutEngine";

/**
 * Traverses down the graph from (and including) the given node to the leaf node and returns all the nodes
 * @param graph The graph to traverse
 * @param node The node to start the traversal from
 * @returns An array of all the nodes that are connected to the given node
 */
export function getAllConnectedNodesFromNodeToLeafNode(
  graph: {
    nodes: Array<GraphNode>;
    edges: Array<GraphEdge>;
  },
  node: GraphNode
): GraphNode[] {
  const { nodes, edges } = graph;
  const connectedNodes: GraphNode[] = [];
  const currentNodeId = node.id;

  //Add the current node
  connectedNodes.push(node);

  function addChildNodes(currentNodeId: number) {
    //Get all edges out from the current node
    const edgesFromCurrentNode = edges.filter(
      (edge) => edge.from === currentNodeId
    );
    // Add all connected nodes to our array
    edgesFromCurrentNode.forEach((edge) => {
      connectedNodes.push(nodes.find((n) => n.id === edge.to));
      // repeat untill we have traversed down to every leaf-node
      addChildNodes(edge.to);
    });
  }
  addChildNodes(currentNodeId);
  return connectedNodes;
}
