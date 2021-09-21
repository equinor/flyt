import BaseAPIServices from "./BaseAPIServices";
import { projectTemplatesV1 } from "../assets/projectTemplatesV1";
import { AxiosPromise } from "axios";
import { vsmProject } from "../interfaces/VsmProject";
import { createUrlParams } from "../utils/createUrlParams";

const baseUrl = "/api/v1.0";
//Project aka. VSM aka. Flyt or Flow
export const getProjects = (filter?: {
  q?: string;
  user?: string;
  orderBy?: string;
  page?: number;
  items?: number;
  onlyFavorites?: boolean;
}): Promise<{ projects: [vsmProject]; totalItems: number }> =>
  BaseAPIServices.get(`${baseUrl}/project${createUrlParams(filter)}`).then(
    (value) => {
      return {
        projects: value.data,
        totalItems: parseInt(value.headers.totalitems, 10),
      };
    }
  );

export const createProject = (
  template?: vsmProject
): AxiosPromise<{
  vsmProjectID: number;
}> => {
  if (template) return BaseAPIServices.post(`${baseUrl}/project`, template);
  return BaseAPIServices.post(
    `${baseUrl}/project`,
    projectTemplatesV1.defaultProject
  );
};

export const getProject = (id: string | string[]): Promise<vsmProject> =>
  BaseAPIServices.get(`${baseUrl}/project/${id}`).then((value) => value.data);

export const updateProject = (data) =>
  BaseAPIServices.post(`${baseUrl}/project`, data);

export const deleteProject = (id: string | string[]) =>
  BaseAPIServices.delete(`${baseUrl}/project/${id}`);

export const faveProject = (id: number) =>
  BaseAPIServices.put(`${baseUrl}/project/favorite/${id}`, {});

export const unfaveProject = (id: number) =>
  BaseAPIServices.delete(`${baseUrl}/project/favorite/${id}`);
