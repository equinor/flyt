import { Node, Edge } from "reactflow";
import dagre from "dagre";

const columnsEndPosX = new Map();
const columnsStartPosX = new Map();
const columnsOffsetX = new Map();

const calcColumnOffset = (node) => {
  const { columnId, type, x, width } = node;
  if (type) {
    if (!columnsStartPosX.has(columnId) || columnsStartPosX.get(columnId) > x) {
      columnsStartPosX.set(columnId, x);
    }
    if (
      !columnsEndPosX.has(columnId) ||
      columnsEndPosX.get(columnId) < x + width
    ) {
      columnsEndPosX.set(columnId, x + width);
    }
  }
};

const setColumnsOffsetX = () => {
  let index = 0;
  let totalOffsetX = 0;
  let offsetX;
  columnsStartPosX.forEach((value, key) => {
    if (index === 0) {
      columnsOffsetX.set(key, 0);
    } else {
      offsetX =
        value -
        columnsEndPosX.get(Array.from(columnsEndPosX.keys())[index - 1]);
      totalOffsetX += offsetX < 0 ? 0 - offsetX : offsetX;
      columnsOffsetX.set(key, totalOffsetX);
    }
    index++;
  });
};

export function setLayout(nodes: Node[], edges: Edge[]): Node[] {
  columnsEndPosX.clear();
  columnsStartPosX.clear();
  columnsOffsetX.clear();
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({ rankdir: "TB", nodesep: 0, edgesep: 0, ranksep: 1 });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, {
      width: node.width,
      height: node.height,
      columnId: node.data.columnId,
      type: node.type,
    });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  nodes.forEach((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    calcColumnOffset(nodeWithPosition);
  });

  setColumnsOffsetX();

  nodes.forEach((node) => {
    const { x, y } = dagreGraph.node(node.id);
    node.position = {
      x: x - node.width / 2 + columnsOffsetX.get(node.data.columnId),
      y: y - node.height / 2,
    };

    return node;
  });

  return nodes;
}
