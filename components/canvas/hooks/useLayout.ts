import { Node, Edge } from "reactflow";
import dagre, { Node as DagreNode } from "dagre";
import { NodeDataFull } from "types/NodeData";
import { NodeTypes } from "types/NodeTypes";

const columnSpacing = 150;
let margin = 0;

const createColumn = (
  nodes: Node<NodeDataFull>[],
  edges: Edge[]
): Node<NodeDataFull>[] => {
  const dagreGraph = new dagre.graphlib.Graph<DagreNode>({
    directed: true,
  });
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({
    nodesep: 70,
    edgesep: 0,
    ranksep: 100,
    marginx: margin,
    keeporder: true,
  });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, {
      width: node.width,
      height: node.height,
      columnId: node.data.columnId,
      type: node.type,
      ordernum: node.data.order ? node.data.order : 0,
    });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  let columnEndPosX = 0;

  nodes.forEach((node) => {
    const { x, y } = dagreGraph.node(node.id);
    if (node.width && node.height) {
      node.position = {
        x: x - node.width / 2,
        y: y - node.height / 2,
      };
    }
    if (x > columnEndPosX) {
      columnEndPosX = x;
    }
    return node;
  });
  margin = columnEndPosX + columnSpacing;

  return nodes;
};

export function setLayout(
  nodes: Node<NodeDataFull>[],
  edges: Edge[]
): Node<NodeDataFull>[] {
  margin = 0;
  const layout: Node<NodeDataFull>[] = [];
  const root = nodes.find((node) => node.type === NodeTypes.root);
  root?.data.children.forEach((nodeId) => {
    const columnNodes = nodes.filter((node) => node.data.columnId === nodeId);
    const columnEdges = edges.filter((edge) =>
      columnNodes.find((node) => node.id === edge.source)
    );
    const column = createColumn(columnNodes, columnEdges);
    layout.push(...column);
  });
  return layout;
}
