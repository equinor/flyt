import { Action, action, createStore } from "easy-peasy";

export type ProjectModel = {
  ///// STORE VARIABLES ///////////////
  snackMessage: string | null;
  pqirToBeDeletedId: string | null;
  downloadSnackbar: boolean;
  networkSnackMessage: string | null;

  //// ACTIONS ///////////////////
  setSnackMessage: Action<ProjectModel, string>;
  setPQIRToBeDeletedId: Action<ProjectModel, string | null>;
  setDownloadSnackbar: Action<ProjectModel, boolean>;
  setNetworkSnackMessage: Action<ProjectModel, string | null>;
};

const projectModel: ProjectModel = {
  //State
  snackMessage: null,
  pqirToBeDeletedId: null,
  downloadSnackbar: false,
  networkSnackMessage: null,

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
  setNetworkSnackMessage: action((state, payload) => {
    state.networkSnackMessage = payload;
  }),
};

const store = createStore(projectModel, {
  name: "project",
});

export default store;
