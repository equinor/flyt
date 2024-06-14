import { TaskTypes } from "types/TaskTypes";

export type Task = {
  id: string;
  type: TaskTypes;
  projectId: string;
  description: string;
  solved: boolean;
  number: number;
  category: any;
};
