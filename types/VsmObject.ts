import { taskObject } from "./taskObject";
import { vsmObjectTypes } from "types/vsmObjectTypes";

export type vsmObject = {
  id: string;
  children: string[];
  type: vsmObjectTypes;
  projectId: string;
  index: string;
  description: string;
  role: string;
  duration: number;
  unit: string;
  tasks: taskObject[];
  depth: number;
  order: number;
};
