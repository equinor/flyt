import { AxiosResponse } from "axios";
import BaseAPIServices from "./BaseAPIServices";
import { processLabel } from "interfaces/processLabel";

const baseUrl = "/api/v1.0";

// getLabels will return labels with sorting field "linkCount", from most used label to least used label
export const getLabels = (
  searchText: string | string[]
): Promise<processLabel[]> =>
  BaseAPIServices.get(
    `${baseUrl}/labels?sortingField=linkCount&sortingDirection=descending&searchText=${searchText}`
  ).then((value) => value.data);

export const getLabel = (id: string): Promise<processLabel> =>
  BaseAPIServices.get(`${baseUrl}/labels/${id}`).then((value) => value.data);

export const addLabelToProcess = (
  processID: number,
  label: processLabel | { text: string }
) => {
  return BaseAPIServices.put(`${baseUrl}/project/${processID}/label`, label);
};

export const removeLabelFromProcess = (processID: number, labelID: number) => {
  return BaseAPIServices.delete(
    `${baseUrl}/project/${processID}/label/${labelID}`
  );
};

export const createLabel = (label: processLabel) => {
  return BaseAPIServices.post(`${baseUrl}/labels`, label);
};
