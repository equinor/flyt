import { vsmProject } from "interfaces/VsmProject";
import BaseAPIServices from "./BaseAPIServices";

const baseUrl = "/api/v1.0";

export const getLabels = (): Promise<vsmProject> =>
  BaseAPIServices.get(`${baseUrl}/labels`).then((value) => value.data);
