import { vsmObjectTypes } from "../types/vsmObjectTypes";
import { vsmTaskTypes } from "../types/vsmTaskTypes";
import { taskObject } from "./taskObject";

export interface vsmObject {
  vsmObjectID?: number;
  vsmProjectID?: number;
  leftObjectId?: number;
  choiceGroup?: "Left" | "Right";
  position?: number;
  parent?: number;
  name?: string;
  fkObjectType?: vsmObjectTypes;
  time?: number;
  timeDefinition?: string;
  role?: string;
  childObjects?: Array<number>;
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
