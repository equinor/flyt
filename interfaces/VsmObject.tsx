import { vsmObjectTypes } from "../types/vsmObjectTypes";
import { vsmTaskTypes } from "../types/vsmTaskTypes";
import { taskObject } from "./taskObject";

//todo update to match api response
export interface vsmObject {
  vsmObjectID?: number;
  vsmProjectID?: number;
  leftObjectId?: number;
  choiceGroup?: "Left" | "Right";
  position?: number;
  parent?: number;
  name?: string;
  time?: number;
  timeDefinition?: string;
  role?: string;
  childIndex?: number;
  childObjects?: Array<vsmObject>;
  vsmObjectType?: {
    pkObjectType: vsmObjectTypes;
    name?: string;
    description?: null;
    hidden?: boolean;
  };
  tasks?: taskObject[];
  created?: {
    pkChangeLog: number;
    userIdentity: string;
    changeDate: string;
    fkVsm: number;
    fkObject: vsmObjectTypes;
    fkTask: vsmTaskTypes;
  };
  lastUpdated?: {
    pkChangeLog: number;
    userIdentity: string;
    changeDate: string;
    fkVsm: number;
    fkObject: vsmObjectTypes;
    fkTask: vsmTaskTypes;
  };
}
