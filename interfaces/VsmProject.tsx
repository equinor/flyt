import { vsmObjectTypes } from "../types/vsmObjectTypes";
import { vsmTaskTypes } from "../types/vsmTaskTypes";
import { vsmObject } from "./VsmObject";
import { userAccess } from "./UserAccess";
import { processLabel } from "./processLabel";

export interface vsmProject {
  vsmProjectID: number;
  name: string;
  labels: processLabel[];
  created: {
    pkChangeLog: number;
    userIdentity: string;
    changeDate: string;
    fkVsm: number;
    fkObject: vsmObjectTypes;
    fkTask: vsmTaskTypes;
  };
  lastUpdated: {
    pkChangeLog: number;
    userIdentity: string;
    changeDate: string;
    fkVsm: number;
    fkObject: vsmObjectTypes;
    fkTask: vsmTaskTypes;
  };
  objects: Array<vsmObject>;
  userAccesses: Array<userAccess>;
  duplicateOf?: string;
  isFavorite?: boolean;
}
