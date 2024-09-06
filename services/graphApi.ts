const baseUrl = "/api/v2.0";

import BaseAPIServices from "./BaseAPIServices";
import { NodeDataApi, NodeDataApiRequestBody } from "@/types/NodeDataApi";
import { Graph } from "types/Graph";
import { NodeTypes } from "types/NodeTypes";

export const getGraph = (projectId: string | string[]): Promise<Graph> => {
  return BaseAPIServices.get(`${baseUrl}/graph/${projectId}`).then(
    (value) => value.data as Graph
  );
};

export const addVertice = (
  data: NodeDataApiRequestBody,
  projectId: string,
  parentId: string
): Promise<unknown> =>
  BaseAPIServices.post(
    `${baseUrl}/graph/${projectId}/vertices/${parentId}`,
    data
  ).then((r) => r.data);

export const patchGraph = (
  data: NodeDataApi,
  projectId: string | string[],
  vertexId: string
): Promise<NodeDataApi> =>
  BaseAPIServices.put(
    `${baseUrl}/graph/${projectId}/vertices/${vertexId}`,
    data
  ).then((r) => r.data);

export const deleteVertice = (
  vertexId: string,
  projectId: string,
  includeChildren = false
): Promise<string> =>
  BaseAPIServices.delete(
    `${baseUrl}/graph/${projectId}/vertices/${vertexId}?includeSubTree=${includeChildren}`
  ).then((r) => r.data);

export const moveVertice = (
  data: {
    vertexToMoveId: string;
    vertexDestinationParentId: string;
  },
  projectId: string,
  includeChildren: boolean
): Promise<unknown> =>
  BaseAPIServices.post(
    `${baseUrl}/graph/${projectId}/vertices/move-vertex?includeChildren=${includeChildren}`,
    data
  ).then((r) => r.data);

export const addVerticeLeft = (
  data: { type: NodeTypes },
  projectId: string,
  neighbourId: string
): Promise<unknown> =>
  BaseAPIServices.post(
    `${baseUrl}/graph/${projectId}/vertices/${neighbourId}/left`,
    data
  ).then((r) => r.data);

export const addVerticeRight = (
  data: { type: NodeTypes },
  projectId: string,
  neighbourId: string
): Promise<unknown> =>
  BaseAPIServices.post(
    `${baseUrl}/graph/${projectId}/vertices/${neighbourId}/right`,
    data
  ).then((r) => r.data);

export const moveVerticeRightOfTarget = (
  data: { vertexId: string },
  targetId: string,
  projectId: string
): Promise<unknown> =>
  BaseAPIServices.put(
    `${baseUrl}/graph/${projectId}/vertices/${targetId}/right`,
    data
  ).then((r) => r.data);

export const mergeVertices = (
  data: { fromVertexId: string; toVertexId: string },
  projectId: string
): Promise<unknown> =>
  BaseAPIServices.post(
    `${baseUrl}/graph/${projectId}/vertices/connect`,
    data
  ).then((r) => r.data);

export const patchEdge = (
  data: { EdgeValue?: string },
  projectId: string,
  edgeId: string
) => {
  BaseAPIServices.post(
    `${baseUrl}/graph/${projectId}/edges/${edgeId}`,
    data
  ).then((r) => r.data);
};

export const deleteEdge = (
  edgeId: string,
  projectId: string
): Promise<string> =>
  BaseAPIServices.delete(`${baseUrl}/graph/${projectId}/edges/${edgeId}`).then(
    (r) => r.data
  );
