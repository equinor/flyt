import { Action, action, createStore, Thunk, thunk } from "easy-peasy";
import BaseAPIServices from "../services/BaseAPIServices";
import { vsmProject } from "../interfaces/VsmProject";
import { vsmObject } from "../interfaces/VsmObject";
import { debounce } from "../utils/debounce";
import { vsmObjectTypes } from "../types/vsmObjectTypes";
import { taskObject } from "../interfaces/taskObject";
import { canDeleteVSMObject } from "../utils/CanDeleteVSMObect";
import { original } from "immer";

// General pattern Thunk -> Actions -> Set state

export interface ProjectModel {
  ///// STORE VARIABLES ///////////////
  errorProject: Record<string, unknown>;
  fetchingProject: boolean;
  project: vsmProject;
  snackMessage: string | null;
  selectedObject: vsmObject | null;
  //// ACTIONS ///////////////////
  //someAction: Action<model, payload>;
  addTaskToSelectedObject: Action<ProjectModel, taskObject>;
  updateTaskDescriptionInSelectedObject: Action<ProjectModel, taskObject>;
  removeTaskFromSelectedObject: Action<ProjectModel, number>;
  setSelectedObject: Action<ProjectModel, vsmObject | null>;
  patchLocalObject: Action<ProjectModel, vsmObject>;
  setErrorProject: Action<ProjectModel, Record<string, unknown>>;
  setFetchingProject: Action<ProjectModel, boolean>;
  setProject: Action<ProjectModel, vsmProject>;
  setProjectName: Action<ProjectModel, { name?: string }>;
  setSnackMessage: Action<ProjectModel, string>;
  //// THUNKS ///////////////////
  //someThunk: Thunk<Model,Payload,Injections,StoreModel,Result>;
  addObject: Thunk<
    ProjectModel,
    { parent: vsmObject; child: vsmObject; leftObjectId?: number }
  >;
  deleteVSMObject: Thunk<ProjectModel, vsmObject>;
  fetchProject: Thunk<ProjectModel, { id: string | string[] | number }>;
  updateProjectName: Thunk<
    ProjectModel,
    { vsmProjectID: number; name: string; rootObjectId: number }
  >;
  updateVSMObject: Thunk<ProjectModel, vsmObject>;
  addTask: Thunk<ProjectModel, taskObject>;
  updateTask: Thunk<ProjectModel, taskObject>;
  linkTask: Thunk<
    ProjectModel,
    { projectId: number; vsmObjectId: number; taskId: number; task: taskObject }
  >;
  unlinkTask: Thunk<
    ProjectModel,
    { projectId: number; vsmObjectId: number; taskId: number }
  >;
}

const projectModel: ProjectModel = {
  //State
  fetchingProject: false,
  errorProject: null,
  project: null,
  snackMessage: null,
  selectedObject: null, //Todo: Use this instead local state selectedObject in components/VSMCanvas.tsx

  // selectedObject: computed((state) => {
  //   const { project, selectedObjectId } = state;
  //
  // }),

  //Actions
  addTaskToSelectedObject: action((state, payload) => {
    const { selectedObject } = state;
    if (selectedObject) {
      selectedObject.tasks = [...selectedObject.tasks, payload];
    }
  }),
  updateTaskDescriptionInSelectedObject: action((state, newTask) => {
    const { selectedObject } = state;
    if (selectedObject && selectedObject.tasks) {
      const oldTask = selectedObject.tasks.find(
        (t) => t.vsmTaskID === newTask.vsmTaskID
      );
      if (oldTask) oldTask.description = newTask.description;
    }
  }),
  removeTaskFromSelectedObject: action((state, taskId) => {
    const { selectedObject } = state;
    selectedObject.tasks = original(selectedObject.tasks).filter(
      (t) => t?.vsmTaskID !== taskId
    );
  }),
  setFetchingProject: action((state, payload) => {
    state.fetchingProject = payload;
  }),
  setSnackMessage: action((state, payload) => {
    state.snackMessage = payload;
  }),
  setErrorProject: action((state, payload) => {
    state.errorProject = payload;
  }),
  setProject: action((state, payload: vsmProject) => {
    state.project = payload;
  }),
  setSelectedObject: action((state, payload) => {
    state.selectedObject = payload;
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
      // oldObj = newObj //This doesn't work.
      // We need to iterate over each individual object and set them one-by-one
      Object.keys(newObj).forEach((key) => {
        oldObj[key] = newObj[key];
      });
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
      // We expect only one top level child - with parent === 0,
      // but adding a forEach just in case we have multiple.
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
          .then(() => actions.setSnackMessage("✅ Saved title"))
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
  deleteVSMObject: thunk(async (actions, payload) => {
    const { vsmObjectID, vsmProjectID } = payload;

    if (canDeleteVSMObject(payload)) {
      BaseAPIServices.delete(`/api/v1.0/VSMObject/${vsmObjectID}`)
        .then(() => {
          // Todo: delete the object locally
          //  Until then, just refresh the whole project
          actions.fetchProject({ id: vsmProjectID });
          actions.setSelectedObject(null);
          return actions.setSnackMessage("Deleted object");
        })
        .catch((reason) => {
          actions.setSnackMessage(reason);
          return actions.setErrorProject(reason);
        });
    } else {
      actions.setSnackMessage("Cannot delete that card");
    }
  }),
  addTask: thunk(async (actions, payload) => {
    //Tasks aka. QIP ( Questions Ideas & Problems )
    actions.setErrorProject(null);
    BaseAPIServices.post(`/api/v1.0/task`, payload)
      .then((response) => {
        actions.setSnackMessage("✅ Task added!");

        actions.addTaskToSelectedObject(response.data);

        //Todo: locally update before api-update?
        actions.fetchProject({ id: response.data.fkProject });
      })
      .catch((reason) => {
        actions.setSnackMessage(reason);
        return actions.setErrorProject(reason);
      });
  }),
  updateTask: thunk(async (actions, payload) => {
    //Tasks aka. QIP ( Questions Ideas & Problems )
    actions.setErrorProject(null);
    BaseAPIServices.post(`/api/v1.0/task`, payload)
      .then((response) => {
        actions.setSnackMessage("✅ Task updated!");

        actions.updateTaskDescriptionInSelectedObject(response.data);

        //Todo: locally update before api-update?
        actions.fetchProject({ id: response.data.fkProject });
      })
      .catch((reason) => {
        actions.setSnackMessage(reason);
        return actions.setErrorProject(reason);
      });
  }),
  unlinkTask: thunk(async (actions, payload) => {
    //Tasks aka. QIP ( Questions Ideas & Problems )
    actions.setErrorProject(null);

    const { projectId, vsmObjectId, taskId } = payload;
    //Not really deleting, but rather unlinking the task.
    BaseAPIServices.delete(
      `/api/v1.0/task/unlink/${vsmObjectId}/${taskId}`,
      payload
    )
      .then(() => {
        actions.setSnackMessage("✅ Unlinked task!");
        // actions.removeTaskFromSelectedObject(response.data);
        actions.removeTaskFromSelectedObject(taskId);
        //Todo: locally update before api-update?
        actions.fetchProject({ id: projectId });
      })
      .catch((reason) => {
        actions.setSnackMessage(reason);
        return actions.setErrorProject(reason);
      });
  }),
  linkTask: thunk(async (actions, payload) => {
    //Tasks aka. QIP ( Questions Ideas & Problems )
    actions.setErrorProject(null);

    const { projectId, vsmObjectId, taskId, task } = payload;
    //Not really deleting, but rather unlinking the task.
    BaseAPIServices.put(`/api/v1.0/task/link/${vsmObjectId}/${taskId}`, payload)
      .then(() => {
        actions.setSnackMessage("✅ Linked task!");
        // actions.removeTaskFromSelectedObject(response.data);
        //Todo: a
        actions.addTaskToSelectedObject(task);

        //Todo: locally update before api-update?
        actions.fetchProject({ id: projectId });
      })
      .catch((reason) => {
        actions.setSnackMessage(reason);
        return actions.setErrorProject(reason);
      });
  }),
  addObject: thunk(async (actions, payload) => {
    //We need to update the child in the API, but the Parent (with the child) in our local state
    const { parent, child, leftObjectId } = payload;
    const apiObject = {
      ...child,
      leftObjectId,
      vsmObjectID: 0, // use 0 when it is a new card
    } as vsmObject;

    //Local temporary card
    // const localObject = {
    //   ...payload.child,
    //   temporaryId: payload.child.vsmObjectID,
    // } as vsmObject;

    actions.setSnackMessage("Adding new card...");
    //NOTE: if the parent is root, then we don't want to adopt its children.
    // Since we are adding a card to the top-level... ( this would be a horizontal, not vertical add)
    const addingCardToTopLevel = parent.parent === 0;
    if (addingCardToTopLevel) {
      BaseAPIServices.post(`/api/v1.0/VSMObject`, apiObject)
        .then((response) => {
          actions.setSnackMessage("Card added!");
          //Api response.data is the newly created child
          // Add this child to the parent
          //Todo: locally update before api-update?
          actions.fetchProject({ id: response.data.vsmProjectID });
        })
        .catch((reason) => {
          actions.setSnackMessage(reason);
          return actions.setErrorProject(reason);
        });
    } else {
      BaseAPIServices.post(`/api/v1.0/VSMObject`, apiObject)
        .then((response) => {
          //Api response.data is the newly created child
          // LOCAL STEP 1 & STEP 2
          actions.patchLocalObject({
            ...parent,
            childObjects: [
              {
                ...response.data,
                childObjects: [...parent.childObjects],
              },
            ], // Todo: Sort the siblings in the correct order
          });
          actions.setSnackMessage("Card added!");
          // - STEP 2. Update our siblings to have the new object as a parent
          if (parent.childObjects.length > 0) {
            parent.childObjects.forEach((sibling) => {
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
    }
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
            .then(() => actions.setSnackMessage("✅ Saved title"))
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
          .then(() => actions.setSnackMessage("✅ Saved"))
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

const store = createStore(projectModel, {
  name: "project",
});
export default store;
