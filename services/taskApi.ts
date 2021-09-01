import BaseAPIServices from "./BaseAPIServices";
import { taskObject } from "../interfaces/taskObject";

const baseUrl = "/api/v1.0";

//Questions, Ideas & Problems aka. Tasks
// Gets a list of task types registered
export const getTaskTypes = (): Promise<
  Array<{ vsmTaskTypeID: number; name: string; description: string | null }>
> =>
  BaseAPIServices.get(baseUrl + "/task/taskTypes").then((value) => value.data);

// Get a list of tasks created in the project identified by its projectId (vsmId)
export const getTasksForProject = (
  vsmId: string | string[]
): Promise<Array<taskObject>> =>
  BaseAPIServices.get(baseUrl + `/task/list/${vsmId}`).then(
    (value) => value.data
  );

export const getTasksForProjectWithType = (
  vsmId: string | string[],
  taskType: number
): Promise<Array<taskObject>> =>
  BaseAPIServices.get(baseUrl + `/task/list/${vsmId}/${taskType}`).then(
    (value) => value.data
  );

// Gets a task by its taskId
export const getTask = (
  vsmId: number | string | string[],
  taskId: number | string | string[]
): Promise<taskObject> =>
  BaseAPIServices.get(baseUrl + `/task/${vsmId}/${taskId}`).then(
    (value) => value.data
  );

// Deletes the task represented by the taskId
export const deleteTask = (vsmId: number, taskId: number) =>
  BaseAPIServices.delete(baseUrl + `/task/list/${vsmId}/${taskId}`);

// Save or update a task. If the taskId is present it updates the task otherwise a new task is created.s
export const createTask = (task: taskObject) =>
  BaseAPIServices.post(baseUrl + `/task`, task).then((r) => r.data);

// Saves or updates a task, if the taskId is present it updates the task otherwise a new task is created
export const updateTask = (data: taskObject) =>
  BaseAPIServices.post(baseUrl + `/task`, data);

//Perform a patch on one or more of the task properties, omit the properties not to update
export const patchTask = (data: taskObject) =>
  BaseAPIServices.patch(baseUrl + `/task`, data);

//Link a task to a vsmObject (card)
export const linkTask = (vsmObjectId: number, taskId: number) =>
  BaseAPIServices.put(
    baseUrl + `/task/link/${vsmObjectId}/${taskId}`,
    null
  ).then((r) => {
    return r.data;
  });

//Remove a link between a task and a vsmObject (card)
export const unlinkTask = (vsmObjectId: number, taskId: number) =>
  BaseAPIServices.delete(
    baseUrl + `/task/unlink/${vsmObjectId}/${taskId}`,
    null
  );
