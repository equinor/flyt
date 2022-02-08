import { AxiosPromise, AxiosResponse } from "axios";

import BaseAPIServices from "./BaseAPIServices";
import { createUrlParams } from "../utils/createUrlParams";
import { processLabel } from "interfaces/processLabel";
import { projectTemplatesV1 } from "../assets/projectTemplatesV1";
import { vsmProject } from "../interfaces/VsmProject";

const baseUrl = "/api/v1.0";
//Project aka. VSM aka. Flyt or Flow
export const getProjects = (filter?: {
  q?: string | string[]; // Search query
  ru?: (number | string)[]; // Required user(s)
  rl?: (number | string)[]; // Required label(s)
  orderBy?: "name" | "modified" | "created"; // Order by name, modified or created
  page?: number; // Page number
  items?: number; // Number of items per page
  onlyFavorites?: boolean; // Only favorites
}): Promise<{ projects: vsmProject[]; totalItems: number }> =>
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
  BaseAPIServices.put(`${baseUrl}/project/${id}/favorite`, null);

export const unfaveProject = (id: number) =>
  BaseAPIServices.delete(`${baseUrl}/project/${id}/favorite`);

export const getLabels = (id: number): Promise<processLabel> =>
  BaseAPIServices.get(`${baseUrl}/project/${id}/labels`).then(
    (value) => value.data
  );

export const resetProcess = (
  id: number | string | string[]
): Promise<AxiosResponse> =>
  BaseAPIServices.patch(`${baseUrl}/project/${id}/reset`, null);
