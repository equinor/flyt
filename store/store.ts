import { Action, action, createStore } from "easy-peasy";

export type ProjectModel = {
  snackMessage: string | null;
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
