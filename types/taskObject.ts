import { vsmTaskTypes } from "types/vsmTaskTypes";

export type taskObject = {
  id?: string;
  type?: vsmTaskTypes;
  projectId?: string;
  description?: string;
  solved?: boolean;
  number?: number;
};
