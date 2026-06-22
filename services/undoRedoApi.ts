import BaseAPIServices from "./BaseAPIServices";

const baseUrl = "/api/v2.0";

// UNDO-REDO

/**
 *  Perform undo redo for the process
 * @param projectId
 */

export const undoProcess = (projectId: string) => {
  return BaseAPIServices.get(`${baseUrl}/undoRedo/undo/${projectId}`);
};

export const redoProcess = (projectId: string) => {
  return BaseAPIServices.get(`${baseUrl}/undoRedo/redo/${projectId}`);
};

export const deleteProcess = (projectId: string) => {
  return BaseAPIServices.delete(`${baseUrl}/undoRedo/clear/${projectId}`);
};
