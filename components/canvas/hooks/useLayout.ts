import { Node, Edge } from "reactflow";
import { stratify } from "d3-hierarchy";
import { flextree } from "d3-flextree";

const layout = flextree({
  nodeSize: (node) => {
    const { width, height } = node?.data?.data;
    return [width, height];
  },
});

const columnsEndPosX = new Map();
const columnsStartPosX = new Map();
const columnsOffsetX = new Map();

function layoutNodes(nodes: Node[], edges: Edge[]): Node[] {
  const hierarchy = stratify<Node>()
    .id((d) => d.id)
    .parentId((d: Node) => edges.find((e: Edge) => e.target === d.id)?.source)(
    nodes
  );

  const tree = layout.hierarchy(hierarchy);
  const root = layout(tree);

  root.descendants().forEach((d) => {
    const columnId = d.data.data.data.columnId;
    const type = d?.data?.data?.data?.card?.type;
    if (type) {
      if (
        !columnsStartPosX.has(columnId) ||
        columnsStartPosX.get(columnId) > d.x
      ) {
        columnsStartPosX.set(columnId, d.x);
      }
      if (
        !columnsEndPosX.has(columnId) ||
        columnsEndPosX.get(columnId) < d.x + d?.data?.data?.width
      ) {
        columnsEndPosX.set(columnId, d.x + d?.data?.data?.width);
      }
    }
  });

  return root.descendants().map((d) => {
    return { ...d.data.data, position: { x: d.x, y: d.y } };
  });
}

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

export const setLayout = (nodes, edges) => {
  const targetNodes = layoutNodes(
    nodes,
    edges.sort((a, b) => Number(b.source) - Number(a.source))
  );
  setColumnsOffsetX();

  return targetNodes.map((node) => {
    return {
      id: node.id,
      position: {
        x: node.position.x + columnsOffsetX.get(node.data.columnId),
        y: node.position.y,
      },
      data: { ...node.data },
      type: node.type,
    };
  });
};
