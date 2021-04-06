import { vsmTaskTypes } from "../types/vsmTaskTypes";
import { vsmObject } from "./VsmObject";

export interface taskObject {
  vsmTaskID?: number; // On Post -> Set to null if new task
  draft?: boolean; // Only used locally. Remove before sending to api
  fkTaskType: vsmTaskTypes;
  taskType?: { vsmTaskTypeID: vsmTaskTypes; name: string; description: string };
  name?: string;
  description?: string;
  solved?: boolean;
  solvedDate?: string;
  fkProject: number;
  dsiplayIndex: string; // Todo: fix after this is resolved https://equinor-sds-si.atlassian.net/browse/VSM-67?focusedCommentId=25963
  objects?: [
    {
      fkObject: vsmObject["vsmObjectID"];
    }
  ];
  changeLogs?: unknown[];
}
