import { Project } from "./Project";
import { Task } from "./Task";
import { NodeTypes } from "types/NodeTypes";

export type NodeDataCommonApi = {
  id: string;
  type: NodeTypes;
  projectId: string;
  index: string | null;
  order: number | null;
  description: string;
  role: string | null;
  duration: number | null;
  unit: string | null;
  children: string[];
  tasks: Task[];
};

export type NodeDataLinkedProcessApi = NodeDataCommonApi &
  Pick<Project, "name" | "updated" | "userAccesses"> & {
    linkedProcessId: string;
  };

export type NodeDataInteractableApi =
  | NodeDataCommonApi
  | NodeDataLinkedProcessApi;

export type NodeDataApiRequestBody = Pick<NodeDataCommonApi, "type"> &
  Partial<
    Pick<
      NodeDataCommonApi,
      "description" | "role" | "duration" | "unit" | "tasks"
    >
  >;
