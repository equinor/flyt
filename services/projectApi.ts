import { AxiosPromise, AxiosResponse } from "axios";

import BaseAPIServices from "./BaseAPIServices";
import { createUrlParams } from "@/utils/createUrlParams";
import { ProcessLabel } from "@/types/ProcessLabel";
import { Project } from "@/types/Project";

const baseUrl = "/api/v2.0";
//Project aka. VSM aka. Flyt or Flow
export const getProjects = (filter: {
  q?: string | string[]; // Search query
  ru?: (number | string)[]; // Required user(s)
  rl?: (number | string)[]; // Required label(s)
  orderBy?: "name" | "modified" | "created" | string; // Order by name, modified or created
  page?: number; // Page number
  items?: number; // Number of items per page
  onlyFavorites?: boolean; // Only favorites
}): Promise<{ projects: Project[]; totalItems: number }> =>
  BaseAPIServices.get(`${baseUrl}/project${createUrlParams(filter)}`).then(
    (value) => {
      return {
        projects: value.data as Project[],
        totalItems: parseInt(value.headers.totalitems, 10),
      };
    }
  );

export const createProject = (): AxiosPromise<{
  vsmProjectID: number;
}> => BaseAPIServices.post(`${baseUrl}/project`, {});

export const createToBeProject = (id?: string | string[]) => {
  return BaseAPIServices.post(`${baseUrl}/project/${id}/tobe`, null);
};

/**
 * Get project by id
 * @param id project id
 * @param asOf
 * @returns VSM Process
 */
export const getProject = async (
  id: string | string[],
  asOf?: number | string | string[]
): Promise<Project> => {
  if (asOf) {
    const value = await BaseAPIServices.get(
      `${baseUrl}/project/${id}?asOf=${asOf}`
    );
    return value.data as Project;
  }
  const value_1 = await BaseAPIServices.get(`${baseUrl}/project/${id}`);
  return value_1.data as Project;
};

export const updateProject = (
  projectId: string | string[],
  data: [{ op: string; path: string; value: string }]
) => BaseAPIServices.patch(`${baseUrl}/project/${projectId}`, data);

export const deleteProject = (id: number | number[]) =>
  BaseAPIServices.delete(`${baseUrl}/project/${id}`);

export const duplicateProject = (id: number): Promise<ProcessLabel> =>
  BaseAPIServices.post(`${baseUrl}/project/${id}/duplicate`, null).then(
    (value) => value.data
  );

export const faveProject = (id: number | undefined) =>
  BaseAPIServices.put(`${baseUrl}/project/${id}/favorite`, null);

export const unfaveProject = (id: number | undefined) =>
  BaseAPIServices.delete(`${baseUrl}/project/${id}/favorite`);

export const resetProcess = (
  id: number | string | string[]
): Promise<AxiosResponse> =>
  BaseAPIServices.post(`${baseUrl}/project/${id}/reset`, null);
