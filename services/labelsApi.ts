import BaseAPIServices from "./BaseAPIServices";
import { ProcessLabel } from "@/types/ProcessLabel";

const baseUrl = "/api/v2.0";

// getLabels will return labels with sorting field "linkCount", from most used label to least used label
export const getLabels = (
  searchText: string | string[]
): Promise<ProcessLabel[]> =>
  BaseAPIServices.get(
    `${baseUrl}/labels?sortingField=linkCount&sortingDirection=descending&searchText=${searchText}`
  ).then((value) => value.data as ProcessLabel[]);

export const getLabel = (id: string): Promise<ProcessLabel> =>
  BaseAPIServices.get(`${baseUrl}/labels/${id}`).then((value) => value.data);

export const addLabelToProcess = (
  processID: number,
  label: ProcessLabel | { text: string }
) => {
  return BaseAPIServices.put(`${baseUrl}/project/${processID}/label`, label);
};

export const removeLabelFromProcess = (processID: number, labelID: number) => {
  return BaseAPIServices.delete(
    `${baseUrl}/project/${processID}/label/${labelID}`
  );
};

export const createLabel = (label: ProcessLabel) => {
  return BaseAPIServices.post(`${baseUrl}/labels`, label);
};
