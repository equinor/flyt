import { Project } from "./Project";
import { Task } from "./Task";
import { NodeTypes } from "types/NodeTypes";

export type NodeDataApi = {
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
  linkedProject: string | null;
  linkedProjectData: Project | null;
};

export type NodeDataApiRequestBody = Pick<NodeDataApi, "type"> &
  Partial<
    Pick<NodeDataApi, "description" | "role" | "duration" | "unit" | "tasks">
  >;
