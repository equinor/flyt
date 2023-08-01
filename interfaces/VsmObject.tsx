import { vsmObjectTypes } from "../types/vsmObjectTypes";
import { vsmTaskTypes } from "../types/vsmTaskTypes";
import { taskObject } from "./taskObject";

export interface vsmObject {
  id?: string;
  children?: Array<string>;
  type?: string;
  projectId?: string;
  index?: string;
  description?: string;
  role?: string;
  duration?: number;
  unit?: string;
  tasks?: Array<taskObject>;
  depth?: number;
  columnId?: string;
}
