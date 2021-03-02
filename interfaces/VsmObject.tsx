import { vsmObjectTypes } from "../types/vsmObjectTypes";
import { vsmTaskTypes } from "../types/vsmTaskTypes";

export interface vsmObject {
  vsmObjectID: number;
  vsmProjectID?: number;
  bigBrother?: number; //Todo: figure out with Peder how this will work
  parent?: number;
  name: string;
  fkObjectType?: number;
  time: number;
  role: string;
  childObjects?: Array<vsmObject>;
  vsmObjectType?: {
    pkObjectType: vsmObjectTypes;
    name: string;
    description: null;
    hidden: boolean;
  };
  tasks?: [];
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
