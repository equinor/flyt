import { NodeDataInteractableApi } from "./NodeDataApi";
import { EdgeDataApi } from "./EdgeDataApi";

export type Graph = {
  vertices: NodeDataInteractableApi[];
  edges: EdgeDataApi[];
};
