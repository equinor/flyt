import { vsmTaskTypes } from "types/vsmTaskTypes";

export interface taskObject {
  id?: string;
  type?: vsmTaskTypes;
  projectId?: string;
  description?: string;
  solved?: boolean;
  number?: number;
}
