import { Edge, Node } from "reactflow";

export type CustomEdge = Edge & {
  order?: number | undefined;
};

export const getEdgeOrder = (edges: Edge[], nodes: Node[]) => {
  edges = edges.map((edges) => {
    const order =
      nodes.find((node) => node.id === edges.target)?.data.order ?? 0;
    return { ...edges, order } as CustomEdge;
  });
  edges.sort((a, b) => {
    const orderA = (a as CustomEdge).order ?? 0;
    const orderB = (b as CustomEdge).order ?? 0;

    return orderA - orderB;
  });
  return edges;
};
