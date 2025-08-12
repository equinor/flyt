import { TaskTypes } from "types/TaskTypes";

export type Task = {
  id: string;
  type: TaskTypes;
  projectId: string;
  description: string;
  solved: boolean | null;
  number: number;
  category: any;
  activityType: string;
  role: string;
};

export type TaskUpdatePayload = Task & {
  isSolvedSingleCard?: boolean;
};
