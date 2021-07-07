import BaseAPIServices from "./BaseAPIServices";
import { taskObject } from "../interfaces/taskObject";
import { vsmProject } from "../interfaces/VsmProject";

const baseUrl = "/api/v1.0";

//Questions, Ideas & Problems aka. Tasks
// Gets a list of task types registered
export const getTaskTypes = () =>
  BaseAPIServices.get("task/taskTypes").then((value) => value.data);

// Get a list of tasks created in the project identified by its projectId (vsmId)
export const getTasksForProject = (
  vsmId: string | string[]
): Promise<Array<taskObject>> =>
  BaseAPIServices.get(baseUrl + `/task/list/${vsmId}`).then(
    (value) => value.data
  );
// Gets a task by its taskId

export const getTask = (vsmId: number, taskId: number) =>
  BaseAPIServices.get(baseUrl + `/task/list/${vsmId}/${taskId}`).then(
    (value) => value.data
  );

// Deletes the task represented by the taskId
export const deleteTask = (vsmId: number, taskId: number) =>
  BaseAPIServices.delete(baseUrl + `/task/list/${vsmId}/${taskId}`);

// Saves or updates a task, if the taskId is present it updates the task otherwise a new task is created
export const createTask = (data: taskObject) =>
  BaseAPIServices.post(baseUrl + `/task`, data).then((r) => r.data);

export const createAndLinkTask = (task: taskObject, projectId: number) =>
  BaseAPIServices.post(baseUrl + `/task`, task).then((r) => {
    const newTask: taskObject = r.data;
    return linkTask(projectId, newTask.vsmTaskID).then((r) => {
      return r.data;
    });
  });

// Saves or updates a task, if the taskId is present it updates the task otherwise a new task is created
export const updateTask = (data: taskObject) =>
  BaseAPIServices.post(baseUrl + `/task`, data);

//Perform a patch on one or more of the task properties, omit the properties not to update
export const patchTask = (data: taskObject) =>
  BaseAPIServices.patch(baseUrl + `/task`, data);

//Link a task to a vsmObject (card)
export const linkTask = (
  vsmObjectId: number,
  taskId: number
  // { projectId, task }
) =>
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
  ).then((r) => r.data);
