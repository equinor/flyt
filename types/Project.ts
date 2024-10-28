import { ProcessLabel } from "./ProcessLabel";
import { userAccess } from "./UserAccess";
import { NodeDataApi } from "./NodeDataApi";

export type Project = {
  vsmProjectID: number;
  name: string | null;
  toBeProcessID?: number;
  currentProcessId?: number;
  labels: ProcessLabel[];
  created: string; // date
  updated: string; // date
  updatedBy: string;
  objects: NodeDataApi[];
  userAccesses: userAccess[];
  duplicateOf?: number;
  isFavorite?: boolean;
};
