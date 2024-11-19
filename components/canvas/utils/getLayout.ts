import { Node, Edge } from "reactflow";
import dagre, { Node as DagreNode } from "dagre";
import { NodeDataCommon, NodeDataFull } from "types/NodeData";
import { NodeTypes } from "types/NodeTypes";

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

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

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

const getColumnMargin = (nodes: Node[], columnSpacing = 0) => {
  let highestPosX = 0;
  nodes.forEach((n) => {
    const { x } = n.position;
    if (x > highestPosX) {
      highestPosX = x;
    }
  });
  return highestPosX + columnSpacing;
};

export function getVSMLayout(
  nodes: Node<NodeDataFull>[],
  edges: Edge[]
): Node<NodeDataFull>[] {
  const columnSpacing = 220;
  let margin = 0;
  const layout: Node<NodeDataFull>[] = [];
  const root = nodes.find((node) => node.type === NodeTypes.root);
  root?.data.children.forEach((nodeId) => {
    const columnNodes = nodes.filter((node) => node.data.column?.id === nodeId);
    const columnEdges = edges.filter((edge) =>
      columnNodes.find((node) => node.id === edge.source)
    );
    const column = getLayout(columnNodes, columnEdges, { margin: margin });
    margin = getColumnMargin(columnNodes, columnSpacing);
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
