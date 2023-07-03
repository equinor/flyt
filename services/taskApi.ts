import BaseAPIServices from "./BaseAPIServices";
import { taskObject } from "../interfaces/taskObject";

const baseUrl = "/api/v2.0";

//Questions, Ideas & Problems aka. Tasks
// Gets a list of task types registered
export const getTaskTypes = (): Promise<
  Array<{ vsmTaskTypeID: string; name: string; description: string | null }>
> =>
  BaseAPIServices.get(baseUrl + "/task/taskTypes").then((value) => value.data);

// Get a list of tasks created in the project identified by its projectId (vsmId)
export const getTasksForProject = (
  projectId: string | string[]
): Promise<Array<taskObject>> =>
  BaseAPIServices.get(`${baseUrl}/graph/${projectId}/tasks`).then(
    (value) => value.data
  );

export const getTasksForProjectWithType = (
  vsmId: string | string[],
  taskType: string
): Promise<Array<taskObject>> =>
  BaseAPIServices.get(baseUrl + `/task/list/${vsmId}/${taskType}`).then(
    (value) => value.data
  );

// Gets a task by its taskId
export const getTask = (
  vsmId: string | string[],
  taskId: string | string[]
): Promise<taskObject> =>
  BaseAPIServices.get(baseUrl + `/task/${vsmId}/${taskId}`).then(
    (value) => value.data
  );

// Deletes the task represented by the taskId
export const deleteTask = (
  projectId: string,
  vertexId: string,
  taskId: string
) =>
  BaseAPIServices.delete(
    `${baseUrl}/graph/${projectId}/vertices/${vertexId}/tasks/${taskId}`
  );

// Save or update a task. If the taskId is present it updates the task otherwise a new task is created.s
export const createTask = (
  data: taskObject,
  projectId: string,
  vertexId: string
) =>
  BaseAPIServices.post(
    `${baseUrl}/graph/${projectId}/vertices/${vertexId}/tasks`,
    data
  );

// Saves or updates a task, if the taskId is present it updates the task otherwise a new task is created
export const updateTask = (
  data: taskObject,
  projectId: string | string[],
  taskId: string
) => BaseAPIServices.put(`${baseUrl}/graph/${projectId}/tasks/${taskId}`, data);

// Saves or updates a task, if the taskId is present it updates the task otherwise a new task is created
export const getTasks = (projectId: string | string[], vertexId: string) =>
  BaseAPIServices.get(
    `${baseUrl}/graph/${projectId}/vertices/${vertexId}/tasks`
  );

//Perform a patch on one or more of the task properties, omit the properties not to update
export const patchTask = (data: taskObject) =>
  BaseAPIServices.patch(baseUrl + `/task`, data);

//Link a task to a vsmObject (card)
export const linkTask = (
  projectId: string | string[],
  vertexId: string,
  taskId: string
) =>
  BaseAPIServices.put(
    baseUrl + `/graph/${projectId}/vertices/${vertexId}/tasks/${taskId}`,
    null
  ).then((r) => {
    return r.data;
  });

//Remove a link between a task and a vsmObject (card)
export const unlinkTask = (vsmObjectId: string, taskId: string) =>
  BaseAPIServices.delete(
    baseUrl + `/task/unlink/${vsmObjectId}/${taskId}`,
    null
  );

// Mark a task as done
export const solveTask = (
  projectId: string | string[],
  vertexId: string,
  taskId: string,
  solved: boolean
) =>
  BaseAPIServices.post(
    baseUrl + `/graph/${projectId}/vertices/${vertexId}/tasks/${taskId}`,
    {
      solved,
    }
  ).then((r) => {
    return r.data;
  });
