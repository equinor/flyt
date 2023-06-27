import { Node, Edge } from "reactflow";
// import { flextree } from "d3-flextree";
import dagre from "dagre";

export function setLayout(nodes: Node[], edges: Edge[]): Node[] {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({ rankdir: "TB", nodesep: 0, edgesep: 0, ranksep: 1 });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, {
      width: node.width,
      height: node.height,
    });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  nodes.forEach((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);

    node.position = {
      x: nodeWithPosition.x - node.width / 2,
      y: nodeWithPosition.y - node.height / 2,
    };

    return node;
  });

  return nodes;
}

// const layout = flextree({
//   nodeSize: (node) => {
//     const { width, height } = node?.data?.data;
//     return [width, height];
//   },
// });

// const columnsEndPosX = new Map();
// const columnsStartPosX = new Map();
// const columnsOffsetX = new Map();
// const mergedCardOffsetY = 0;

// const calcColumnOffset = (d) => {
//   const columnId = d.data.data.data.columnId;
//   const type = d?.data?.data?.data?.card?.type;
//   if (type) {
//     if (
//       !columnsStartPosX.has(columnId) ||
//       columnsStartPosX.get(columnId) > d.x
//     ) {
//       columnsStartPosX.set(columnId, d.x);
//     }
//     if (
//       !columnsEndPosX.has(columnId) ||
//       columnsEndPosX.get(columnId) < d.x + d?.data?.data?.width
//     ) {
//       columnsEndPosX.set(columnId, d.x + d?.data?.data?.width);
//     }
//   }
// };

// const setColumnsOffsetX = () => {
//   let index = 0;
//   let totalOffsetX = 0;
//   let offsetX;
//   columnsStartPosX.forEach((value, key) => {
//     if (index === 0) {
//       columnsOffsetX.set(key, 0);
//     } else {
//       offsetX =
//         value -
//         columnsEndPosX.get(Array.from(columnsEndPosX.keys())[index - 1]);
//       totalOffsetX += offsetX < 0 ? 0 - offsetX : offsetX;
//       columnsOffsetX.set(key, totalOffsetX);
//     }
//     index++;
//   });
// };

// const calcMergedCardOffsetY = (d, nodes) => {
//   const node = d.data.data.data;
//   let lowestParentCard = d;
//   console.log(1, d.y);
//   node.parentCards.forEach((parent) => {
//     const a = nodes.find((node) => node.data.id === parent.id);
//     console.log(2, a);
//     if (lowestParentCard.y < a.y) {
//       lowestParentCard = a;
//     }
//   });

//   return lowestParentCard.y + lowestParentCard.data.data.height;
// }).reduce((prev, curr) => {
//   console.log(prev.y, curr.y, d.parent)
//   return prev.y > curr.y ? prev.y : curr.y;
// });
//console.log(d.y, lowestParentPosY);
// };

// function layoutNodes(nodes: Node[], edges: Edge[]): Node[] {
//   const hierarchy = stratify<Node>()
//     .id((d) => d.id)
//     .parentId(
//       (d: Node) =>
//         edges.find((e: Edge) => e.target === d.id && e.data.rootParent)?.source
//     )(nodes);

//   console.log(nodes, edges);
//   console.log(1, hierarchy);
//   const tree = layout.hierarchy(hierarchy);
//   console.log(tree, 2);
//   const root = layout(tree);

//   return root.descendants().map((d) => {
//     calcColumnOffset(d);
//     const mergedCardOffsetY = 0;
//     if (d.data.data.data.parentCards?.length > 1) {
//       //d.y = calcMergedCardOffsetY(d, root.descendants());
//     }
//     return {
//       ...d.data.data,
//       position: {
//         x: d.x,
//         y: d.y,
//       },
//     };
//   });
// }

// export const setLayout = (nodes, edges) => {
//   columnsEndPosX.clear();
//   columnsStartPosX.clear();
//   columnsOffsetX.clear();
//   const targetNodes = layoutNodes(
//     nodes,
//     edges //.sort((a, b) => Number(b.source) - Number(a.source))
//   );
//   setColumnsOffsetX();

//   return targetNodes.map((node) => {
//     //console.log(node)
//     return {
//       id: node.id,
//       position: {
//         x: node.position.x + columnsOffsetX.get(node.data.columnId),
//         y: node.position.y,
//       },
//       data: { ...node.data },
//       type: node.type,
//     };
//   });
// };
