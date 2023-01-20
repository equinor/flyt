import { useEffect, useRef } from "react";
import { useReactFlow, useStore, Node, Edge, ReactFlowState } from "reactflow";
import { stratify, tree } from "d3-hierarchy";
import { timer } from "d3-timer";

const layout = tree<Node>()
  .nodeSize([200, 200])
  .separation(() => 0.83);

const options = { duration: 300 };
const columnsEndPosX = new Map();
const columnsStartPosX = new Map();
const columnsOffsetX = new Map();

function layoutNodes(nodes: Node[], edges: Edge[]): Node[] {
  const hierarchy = stratify<Node>()
    .id((d) => d.id)
    .parentId((d: Node) => edges.find((e: Edge) => e.target === d.id)?.source)(
    nodes
  );

  const root = layout(hierarchy);

  root.descendants().forEach((d) => {
    const columnId = d.data.data.columnId;
    const type = d?.data?.data?.card?.vsmObjectType?.name;
    if (type) {
      if (
        !columnsStartPosX.has(columnId) ||
        columnsStartPosX.get(columnId) > d.x
      ) {
        columnsStartPosX.set(columnId, d.x);
      }
      if (!columnsEndPosX.has(columnId) || columnsEndPosX.get(columnId) < d.x) {
        columnsEndPosX.set(columnId, d.x);
      }
    }
  });

  return root.descendants().map((d) => {
    return { ...d.data, position: { x: d.x, y: d.y } };
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
      // 167 or less is the offset where columns starts to overlap
      totalOffsetX += offsetX < 167 ? 167 - offsetX : offsetX;
      columnsOffsetX.set(key, totalOffsetX);
    }
    index++;
  });
};

const nodeCountSelector = (state: ReactFlowState) => state.nodeInternals.size;

function useLayout() {
  const initial = useRef(true);

  const nodeCount = useStore(nodeCountSelector);

  const { getNodes, getNode, setNodes, setEdges, getEdges, fitView } =
    useReactFlow();

  useEffect(() => {
    const nodes = getNodes();
    const edges = getEdges();
    const targetNodes = layoutNodes(nodes, edges);
    setColumnsOffsetX();

    const transitions = targetNodes.map((node) => {
      return {
        id: node.id,
        from: getNode(node.id)?.position || node.position,
        to: node.position,
        node,
      };
    });

    const t = timer((elapsed: number) => {
      const s = elapsed / options.duration;

      const currNodes = transitions.map(({ node, from, to }) => {
        return {
          id: node.id,
          position: {
            x:
              from.x +
              (to.x + columnsOffsetX.get(node.data.columnId) - from.x) * s,
            y: from.y + (to.y - from.y) * s,
          },
          data: { ...node.data },
          type: node.type,
        };
      });

      setNodes(currNodes);

      if (elapsed > options.duration) {
        const finalNodes = transitions.map(({ node, to }) => {
          return {
            id: node.id,
            position: {
              x: to.x + columnsOffsetX.get(node.data.columnId),
              y: to.y,
            },
            data: { ...node.data },
            type: node.type,
          };
        });
        setNodes(finalNodes);
        t.stop();

        if (!initial.current) {
          fitView({ duration: 200, padding: 0.2 });
        }
        initial.current = false;
      }
    });

    return () => {
      t.stop();
    };
  }, [nodeCount, getEdges, getNodes, getNode, setNodes, fitView, setEdges]);
}

export default useLayout;
