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
