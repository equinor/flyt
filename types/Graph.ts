import { NodeDataApi } from "./NodeDataApi";
import { EdgeDataApi } from "./EdgeDataApi";

export type Graph = {
  vertices: NodeDataApi[];
  edges: EdgeDataApi[];
};
