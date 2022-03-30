import { vsmObject } from "./VsmObject";
import { userAccess } from "./UserAccess";
import { processLabel } from "./processLabel";

export interface vsmProject {
  vsmProjectID: number;
  name: string;
  isFavorite: boolean;
  duplicateOf: number;
  toBeProcessID: number;
  currentProcessId: number;
  objects: vsmObject[];
  created: string; // date
  updated: string; // date
  updatedBy: string; // user
  userAccesses: userAccess[];
  labels: processLabel[];
}
