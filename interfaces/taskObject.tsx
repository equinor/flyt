import { vsmTaskTypes } from "../types/vsmTaskTypes";
import { vsmObject } from "./VsmObject";
import { taskCategory } from "./taskCategory";

export interface taskObject {
  [x: string]: any;
  vsmTaskID?: number; // On Post -> Set to null if new task
  draft?: boolean; // Only used locally. Remove before sending to api
  fkTaskType: vsmTaskTypes;
  taskType?: { vsmTaskTypeID: vsmTaskTypes; name: string; description: string };
  name?: string;
  description?: string;
  solved?: boolean;
  solvedDate?: string;
  fkProject: number;
  displayIndex: string;
  objects?: Array<vsmObject>;
  changeLogs?: unknown[];
  categories?: Array<taskCategory>;
}
