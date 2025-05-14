import { Node, Edge } from "reactflow";
import dagre, { Node as DagreNode } from "dagre";
import { NodeDataCommon, NodeDataFull } from "types/NodeData";
import { NodeTypes } from "types/NodeTypes";
import { CustomEdge, getEdgeOrder } from "./getEdgeOrder";

type Options = {
  rankdir?: string;
  ranksep?: number;
  margin?: number;
};

const getLayout = (
  nodes: Node[],
  edges: Edge[],
  { rankdir = "TB", ranksep = 100, margin = 0 }: Options
) => {
  const dagreGraph = new dagre.graphlib.Graph<DagreNode>({
    directed: true,
  });

  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({
    nodesep: 70,
    edgesep: 0,
    ranksep: ranksep,
    marginx: margin,
    keeporder: true,
    rankdir: rankdir,
  });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, {
      width: node.width,
      height: node.height,
      column: node.data.column,
      type: node.type,
    });
  });

  edges = getEdgeOrder(edges, nodes);

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });
  console.log(dagreGraph);
  dagre.layout(dagreGraph);

  return nodes.map((node) => {
    if (node.width && node.height) {
      const { x, y } = dagreGraph.node(node.id);
      node.position = {
        x: x - node.width / 2,
        y: y - node.height / 2,
      };
    }
    return node;
  });
};

const getColumnMargin = (nodes: Node[]) => {
  let highestPosX = 0;
  nodes.forEach((n) => {
    const { x } = n.position;
    const occupiedSpace = x + (n.width ?? 175.5) + 35; //175.5 is default width of node, 35 is half of nodesep
    if (occupiedSpace > highestPosX) {
      highestPosX = occupiedSpace;
    }
  });
  return highestPosX;
};

export function getVSMLayout(
  nodes: Node<NodeDataFull>[],
  edges: Edge[]
): Node<NodeDataFull>[] {
  let margin = 0;
  const layout: Node<NodeDataFull>[] = [];
  const root = nodes.find((node) => node.type === NodeTypes.root);
  root?.data.children.forEach((nodeId) => {
    const columnNodes = nodes.filter((node) => node.data.column?.id === nodeId);
    const columnEdges = edges.filter((edge) =>
      columnNodes.find((node) => node.id === edge.source)
    );
    const column = getLayout(columnNodes, columnEdges, { margin: margin });
    margin = getColumnMargin(columnNodes);
    layout.push(...column);
  });
  return layout;
}

export const getLinkedProcessesLayout = (
  nodes: Node<NodeDataCommon>[],
  edges: Edge[],
  isHorizontalFlow = false
) => {
  return getLayout(nodes, edges, {
    rankdir: isHorizontalFlow ? "LR" : "TB",
    ranksep: 140,
  });
};
