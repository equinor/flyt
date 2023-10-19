import { processLabel } from "./processLabel";
import { userAccess } from "./UserAccess";
import { vsmObject } from "./VsmObject";

// Todo: Structure is out of date. Update to match new structure.
export type vsmProject = {
  vsmProjectID: number;
  name: string;
  toBeProcessID?: number;
  currentProcessId?: number;
  labels: processLabel[];
  created: string; // date
  updated: string; // date
  updatedBy: string;
  objects: vsmObject[];
  userAccesses: userAccess[];
  duplicateOf?: number;
  isFavorite?: boolean;
};
