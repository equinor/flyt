import BaseAPIServices from "./BaseAPIServices";

const baseUrl = "/api/v2.0";

// UNDO-REDO

/**
 *  Perform undo redo for the process
 * @param projectId
 */

export const undoProcess = (
  projectId: string,
  userMail: string,
  process: []
) => {
  return BaseAPIServices.post(
    `${baseUrl}/undoRedo/undo/${projectId}/${userMail}`,
    process
  );
};

export const redoProcess = (
  projectId: string,
  userMail: string,
  process: []
) => {
  return BaseAPIServices.post(
    `${baseUrl}/undoRedo/redo/${projectId}/${userMail}`,
    process
  );
};

export const deleteProcess = (projectId: string, userMail: string) => {
  return BaseAPIServices.delete(
    `${baseUrl}/undoRedo/clear/${projectId}/${userMail}`
  );
};
