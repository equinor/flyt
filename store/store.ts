import { Action, action, createStore, persist, Thunk, thunk } from "easy-peasy";
import BaseAPIServices from "../services/BaseAPIServices";
import { VsmProject } from "../interfaces/VsmProject";
import { vsmObject } from "../interfaces/VsmObject";
import { debounce } from "../utils/debounce";
import { vsmObjectTypes } from "../types/vsmObjectTypes";

// General pattern Thunk -> Actions -> Set state

export interface ProjectModel {
  setSnackMessage: Action<ProjectModel, string>;
  snackMessage: string | null;
  errorProject: Record<string, unknown>;
  fetchProject: Thunk<ProjectModel, { id: string | string[] | number }>;
  fetchingProject: boolean;
  project: VsmProject;
  setErrorProject: Action<ProjectModel, Record<string, unknown>>;
  setFetchingProject: Action<ProjectModel, boolean>;
  setProject: Action<ProjectModel, VsmProject>;
  updateVSMObject: Thunk<ProjectModel, vsmObject>;
  patchLocalObject: Action<ProjectModel, vsmObject>;
  setProjectName: Action<ProjectModel, { name: string }>;
  updateProjectName: Thunk<
    ProjectModel,
    {
      vsmProjectID: number;
      name: string;
      rootObjectId: number;
    }
  >;
}

const projectModel: ProjectModel = {
  //State
  fetchingProject: false,
  errorProject: null,
  project: null,
  snackMessage: null,

  //Actions
  setFetchingProject: action((state, payload) => {
    state.fetchingProject = payload;
  }),
  setSnackMessage: action((state, payload) => {
    state.snackMessage = payload;
  }),
  setErrorProject: action((state, payload) => {
    state.errorProject = payload;
  }),
  setProject: action((state, payload: VsmProject) => {
    state.project = payload;
  }),
  fetchProject: thunk(async (actions, payload) => {
    const { id } = payload;
    actions.setFetchingProject(true);
    actions.setErrorProject(null);
    BaseAPIServices.get(`/api/v1.0/project/${id}`)
      .then((value) => actions.setProject(value.data))
      .catch((reason) => {
        actions.setSnackMessage(reason);
        return actions.setErrorProject(reason);
      })
      .finally(() => actions.setFetchingProject(false));
  }),
  patchLocalObject: action((state, payload) => {
    const { project } = state;

    function patchNode(oldObj: vsmObject, newObj: vsmObject) {
      // console.log('Updating values', original(oldObj));
      // oldObj = newObj //This doesn't work
      oldObj.name = newObj.name;
      oldObj.role = newObj.role;
      oldObj.time = newObj.time;
    }

    /**
     * Updates all nodes that match the id
     * @param node - What we want to put in the tree
     * @param tree
     */
    function patchNodeInTree(node: vsmObject, tree: vsmObject) {
      if (node.vsmObjectID === tree.vsmObjectID) patchNode(tree, node);
      tree.childObjects.forEach((child) => {
        patchNodeInTree(node, child);
      });
    }

    project.objects.forEach((child) => {
      // We expect only one top level child, but adding a forEach just in case we have multiple...
      patchNodeInTree(payload, child);
    });
  }),
  updateProjectName: thunk((actions, payload) => {
    const { vsmProjectID, name, rootObjectId } = payload;
    actions.setProjectName(payload);
    debounce(
      () => {
        return BaseAPIServices.post(`/api/v1.0/project`, {
          vsmProjectID,
          name,
        })
          .then(() => actions.setSnackMessage("Saved title"))
          .catch((reason) => actions.setErrorProject(reason));
      },
      1000,
      "updateVSMTitle"
    )();
    if (rootObjectId) {
      // Update the root object with the name as well
      debounce(
        () => {
          return BaseAPIServices.patch(`/api/v1.0/VSMObject`, {
            vsmObjectID: rootObjectId,
            name,
          }).catch((reason) => actions.setErrorProject(reason));
        },
        1000,
        "updateVSMObject"
      )();
    }
  }),
  setProjectName: action((state, payload) => {
    state.project.name = payload.name;
    //Update our root node ( Null check that we actually have some children)
    if (state.project.objects?.length > 0) {
      state.project.objects[0].name = payload.name;
    }
  }),
  updateVSMObject: thunk(async (actions, payload) => {
    actions.patchLocalObject(payload);
    actions.setErrorProject(null);

    // Update project title if type is process
    const { vsmProjectID, name, vsmObjectType } = payload;
    if (vsmObjectType.pkObjectType === vsmObjectTypes.process) {
      debounce(
        () => {
          return BaseAPIServices.post(`/api/v1.0/project`, {
            vsmProjectID,
            name,
          })
            .then(() => actions.setSnackMessage("Saved title"))
            .catch((reason) => {
              actions.setSnackMessage(reason);
              return actions.setErrorProject(reason);
            });
        },
        1000,
        "updateVSMTitle"
      )();
    }

    // Send the object-update to api
    debounce(
      () => {
        return BaseAPIServices.patch(`/api/v1.0/VSMObject`, payload)
          .then(() => actions.setSnackMessage("Saved"))
          .catch((reason) => {
            actions.setSnackMessage(reason);
            return actions.setErrorProject(reason);
          });
      },
      1000,
      "updateVSMObject"
    )();
  }),
};

const store = createStore(
  persist(projectModel, {
    allow: ["project"],
  })
);
export default store;
