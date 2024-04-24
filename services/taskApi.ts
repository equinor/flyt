import BaseAPIServices from "./BaseAPIServices";
import { Task } from "../types/Task";

const baseUrl = "/api/v2.0";

// Get a list of tasks created in the project identified by its projectId (vsmId)
export const getTasksForProject = (
  projectId: string | string[]
): Promise<Task[]> =>
  BaseAPIServices.get(`${baseUrl}/graph/${projectId}/tasks`).then(
    (value) => value.data
  );

export const createTask = (data: Task, projectId: string, vertexId: string) =>
  BaseAPIServices.post(
    `${baseUrl}/graph/${projectId}/vertices/${vertexId}/tasks`,
    data
  );

// Saves or updates a task
export const updateTask = (
  data: Task,
  projectId: string | string[],
  taskId: string,
  vertexId: string
) =>
  BaseAPIServices.patch(
    `${baseUrl}/graph/${projectId}/vertices/${vertexId}/tasks/${taskId}`,
    data
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

// Mark a task as done
export const solveTask = (
  projectId: string | string[],
  vertexId: string,
  taskId: string,
  solved: boolean
) =>
  BaseAPIServices.post(
    `${baseUrl}/graph/${projectId}/vertices/${vertexId}/tasks/${taskId}?solved=${solved}`,
    {}
  ).then((r) => {
    return r.data;
  });

//Link a task to a node
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

//Remove a link between a task and a node
export const unlinkTask = (
  projectId: string | string[],
  vsmObjectId: string,
  taskId: string
) =>
  BaseAPIServices.delete(
    baseUrl + `/graph/${projectId}/vertices/${vsmObjectId}/tasks/${taskId}`,
    null
  );
