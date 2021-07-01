import BaseAPIServices from "./BaseAPIServices";
import { projectTemplatesV1 } from "../assets/projectTemplatesV1";
import { AxiosPromise } from "axios";
import { vsmProject } from "../interfaces/VsmProject";

const baseUrl = "/api/v1.0";
//Project aka. VSM aka. Flyt or Flow

export const getProjects = async (): Promise<[vsmProject]> =>
  await BaseAPIServices.get(`${baseUrl}/project`).then((value) => value.data);

export const createProject = (): AxiosPromise<{
  vsmProjectID: number;
}> =>
  BaseAPIServices.post(`${baseUrl}/project`, projectTemplatesV1.defaultProject);

export const getProject = (id: string | string[]): Promise<vsmProject> =>
  BaseAPIServices.get(`${baseUrl}/project/${id}`).then((value) => value.data);

export const updateProject = (data) =>
  BaseAPIServices.post(`${baseUrl}/project`, data);

export const deleteProject = (id: string | string[]) =>
  BaseAPIServices.delete(`${baseUrl}/project/${id}`);
