const baseUrl = "/api/v1.0";
// CARDS aka. VSMObjects

// Gets an object specified by its objectId
import BaseAPIServices from "./BaseAPIServices";
import { vsmObject } from "../interfaces/VsmObject";

export const getVSMObject = (objectId: number): Promise<vsmObject> =>
  BaseAPIServices.get(baseUrl + `/vsmObject/${objectId}`).then(
    (value) => value.data
  );

// Deletes an object and everything beneath it
export const deleteVSMObject = (objectId: number): Promise<unknown> =>
  BaseAPIServices.delete(baseUrl + `/vsmObject/${objectId}`).then(
    (r) => r.data
  );

// Gets a list of objects in the project specified
export const getVSMObjects = (projectId: number): Promise<unknown> =>
  BaseAPIServices.get(baseUrl + `/vsmObject/list/${projectId}`).then(
    (value) => value.data
  );

// Saves or updates a object
export const postVSMObject = (data: vsmObject): Promise<unknown> =>
  BaseAPIServices.post(baseUrl + "/vsmObject", data).then((r) => r.data);

// Updates one or more fields in the objects table
export const patchVSMObject = (data: vsmObject): Promise<vsmObject> =>
  BaseAPIServices.patch(baseUrl + "/vsmObject", data).then((r) => r.data);

// Gets objectTypes used for creating vsm diagrams
export const getVSMObjectTypes = (): Promise<unknown> =>
  BaseAPIServices.get(baseUrl + "/vsmObject/objectTypes").then(
    (value) => value.data
  );

export const moveVSMObject = ({
  vsmProjectID,
  vsmObjectID,
  parent,
  leftObjectId,
  choiceGroup,
}: vsmObject): Promise<vsmObject> =>
  BaseAPIServices.patch(`/api/v1.0/VSMObject`, {
    vsmProjectID,
    vsmObjectID,
    parent,
    leftObjectId,
    choiceGroup,
  }).then((r) => r.data);
