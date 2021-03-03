import { Action, action, createStore, persist, Thunk, thunk } from "easy-peasy";
import BaseAPIServices from "../services/BaseAPIServices";
import { VsmProject } from "../interfaces/VsmProject";
import { vsmObject } from "../interfaces/VsmObject";
import { debounce } from "../utils/debounce";
import { vsmObjectTypes } from "../types/vsmObjectTypes";

// General pattern Thunk -> Actions -> Set state

export interface ProjectModel {
  addObject: Thunk<ProjectModel, { parent: vsmObject; child: vsmObject }>;
  errorProject: Record<string, unknown>;
  fetchProject: Thunk<ProjectModel, { id: string | string[] | number }>;
  fetchingProject: boolean;
  patchLocalObject: Action<ProjectModel, vsmObject>;
  project: VsmProject;
  setErrorProject: Action<ProjectModel, Record<string, unknown>>;
  setFetchingProject: Action<ProjectModel, boolean>;
  setProject: Action<ProjectModel, VsmProject>;
  setProjectName: Action<ProjectModel, { name: string }>;
  setSnackMessage: Action<ProjectModel, string>;
  snackMessage: string | null;
  updateProjectName: Thunk<
    ProjectModel,
    { vsmProjectID: number; name: string; rootObjectId: number }
  >;
  updateVSMObject: Thunk<ProjectModel, vsmObject>;
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
      oldObj.parent = newObj.parent;
      oldObj.childObjects = newObj.childObjects;
    }

    /**
     * Updates all nodes that match the id
     * @param node - What we want to put in the tree
     * @param tree
     */
    function patchNodeInTree(node: vsmObject, tree: vsmObject) {
      if (node.vsmObjectID === tree.vsmObjectID) patchNode(tree, node);
      tree.childObjects?.forEach((child) => {
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
  addObject: thunk(async (actions, payload) => {
    //We need to update the child in the API, but the Parent (with the child) in our local state
    const apiObject = {
      ...payload.child,
      vsmObjectID: 0, // use 0 when it is a new card
    } as vsmObject;

    //Local temporary card
    // const localObject = {
    //   ...payload.child,
    //   temporaryId: payload.child.vsmObjectID,
    // } as vsmObject;

    //Also,if the parent card have children, we want to adopt it's children
    //This needs to be done in two steps:
    // - STEP 1. Add our new object as a sibling
    actions.setSnackMessage("Adding new card...");
    BaseAPIServices.post(`/api/v1.0/VSMObject`, apiObject)
      .then((response) => {
        //Api response.data is the newly created child
        // LOCAL STEP 1 & STEP 2
        actions.patchLocalObject({
          ...payload.parent,
          childObjects: [
            {
              ...response.data,
              childObjects: [...payload.parent.childObjects],
            },
          ], // Todo: Sort the siblings in the correct order
        });
        actions.setSnackMessage("Card added!");
        // - STEP 2. Update our siblings to have the new object as a parent
        if (payload.parent.childObjects.length > 0) {
          payload.parent.childObjects.forEach((sibling) => {
            BaseAPIServices.patch(`/api/v1.0/VSMObject`, {
              ...sibling,
              parent: response.data.vsmObjectID,
            })
              .then(() => actions.setSnackMessage("Updated parent"))
              .catch((reason) => {
                actions.setSnackMessage(reason);
                return actions.setErrorProject(reason);
              });
          });
        }
      })
      .catch((reason) => {
        actions.setSnackMessage(reason);
        return actions.setErrorProject(reason);
      });
  }),
  updateVSMObject: thunk(async (actions, payload) => {
    actions.patchLocalObject(payload);
    actions.setErrorProject(null);

    // We store the VSM title in the name-field and in the root-node.
    // So if the process ( aka the root node ) title is updated, let's update the vsm title as well.
    // ** Update project title if type is process **
    const { vsmProjectID, name, vsmObjectType } = payload;
    if (vsmObjectType.pkObjectType === vsmObjectTypes.process) {
      actions.setProjectName(payload);
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
