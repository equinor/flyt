import { Action, action, createStore } from "easy-peasy";

export type ProjectModel = {
  ///// STORE VARIABLES ///////////////
  snackMessage: string | null;
  pqirToBeDeletedId: string | null;
  downloadSnackbar: boolean;

  //// ACTIONS ///////////////////
  setSnackMessage: Action<ProjectModel, string>;
  setPQIRToBeDeletedId: Action<ProjectModel, string | null>;
  setDownloadSnackbar: Action<ProjectModel, boolean>;
};

const projectModel: ProjectModel = {
  //State
  snackMessage: null,
  pqirToBeDeletedId: null,
  downloadSnackbar: false,

  //Actions
  setSnackMessage: action((state, payload) => {
    state.snackMessage = payload;
  }),
  setPQIRToBeDeletedId: action((state, payload) => {
    state.pqirToBeDeletedId = payload;
  }),
  setDownloadSnackbar: action((state, payload) => {
    state.downloadSnackbar = payload;
  }),
};

const store = createStore(projectModel, {
  name: "project",
});

export default store;
