import { Action, action, createStore } from "easy-peasy";

export type ProjectModel = {
  ///// STORE VARIABLES ///////////////
  snackMessage: string | null;

  //// ACTIONS ///////////////////
  setSnackMessage: Action<ProjectModel, string>;
};

const projectModel: ProjectModel = {
  //State
  snackMessage: null,

  //Actions
  setSnackMessage: action((state, payload) => {
    state.snackMessage = payload;
  }),
};

const store = createStore(projectModel, {
  name: "project",
});

export default store;
