import { processLabel } from "interfaces/processLabel";
import BaseAPIServices from "./BaseAPIServices";

const baseUrl = "/api/v1.0";

export const getLabels = (
  searchText: string | string[]
): Promise<processLabel[]> =>
  BaseAPIServices.get(`${baseUrl}/labels?searchText=${searchText}`).then(
    (value) => value.data
  );

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
