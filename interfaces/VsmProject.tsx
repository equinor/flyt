import { processLabel } from "./processLabel";
import { userAccess } from "./UserAccess";
import { vsmObject } from "./VsmObject";
import { vsmObjectTypes } from "../types/vsmObjectTypes";
import { vsmTaskTypes } from "../types/vsmTaskTypes";

export interface vsmProject {
  vsmProjectID: number;
  name: string;
  toBeProcessID?: number;
  currentProcessId?: number;
  labels: processLabel[];
  created: string; // date
  lastUpdated: string; // date
  objects: Array<vsmObject>;
  userAccesses: Array<userAccess>;
  duplicateOf?: string;
  isFavorite?: boolean;
}
