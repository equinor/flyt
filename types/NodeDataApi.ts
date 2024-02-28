import { Task } from "./Task";
import { NodeTypes } from "types/NodeTypes";

export type NodeDataApi = {
  id: string;
  children: string[];
  type: NodeTypes;
  projectId: string;
  index: string;
  description: string;
  role: string;
  duration: number;
  unit: string;
  tasks: Task[];
  depth: number;
  order: number;
};
