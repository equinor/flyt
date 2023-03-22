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
  removeTaskFromSelectedObject: Action<ProjectModel, string>;
  setSelectedObject: Action<ProjectModel, vsmObject | null>;
  patchLocalObject: Action<ProjectModel, vsmObject>;
  setErrorProject: Action<ProjectModel, Record<string, unknown>>;
  setFetchingProject: Action<ProjectModel, boolean>;
  setProject: Action<ProjectModel, vsmProject>;
  //setProjectName: Action<ProjectModel, { name?: string }>;
  setSnackMessage: Action<ProjectModel, string>;
  //// THUNKS ///////////////////
  //someThunk: Thunk<Model,Payload,Injections,StoreModel,Result>;
  addObject: Thunk<ProjectModel, vsmObject>;
  moveVSMObject: Thunk<
    ProjectModel,
    { projectId; id; parent; leftObjectId; choiceGroup }
  >;
  deleteVSMObject: Thunk<ProjectModel, vsmObject>;
  fetchProject: Thunk<ProjectModel, { id: string | string[] | number }>;
  // updateProjectName: Thunk<
  //   ProjectModel,
  //   { projectId: number; name: string; rootObjectId: number }
  // >;
  //updateVSMObject: Thunk<ProjectModel, vsmObject>;
  addTask: Thunk<ProjectModel, taskObject>;
  updateTask: Thunk<ProjectModel, taskObject>;
  linkTask: Thunk<
    ProjectModel,
    { projectId: number; id: number; taskId: number; task: taskObject }
  >;
  unlinkTask: Thunk<ProjectModel, { task: taskObject; object: vsmObject }>;
}

const projectModel: ProjectModel = {
  //State
  fetchingProject: false,
  errorProject: null,
  project: null,
  snackMessage: null,
  selectedObject: null,

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
      const oldTask = selectedObject.tasks.find((t) => t.id === newTask.id);
      if (oldTask) oldTask.description = newTask.description;
    }
  }),
  removeTaskFromSelectedObject: action((state, taskId) => {
    const { selectedObject } = state;
    selectedObject.tasks = original(selectedObject.tasks).filter(
      (t) => t?.id !== taskId
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
      if (node.id === tree.id) patchNode(tree, node);
      tree.children?.forEach((id) => {
        patchNodeInTree(
          node,
          state.project.objects.find((vsmObj: vsmObject) => vsmObj.id === id)
        );
      });
    }

    project.objects.forEach((child) => {
      // We expect only one top level child - with parent === 0,
      // but adding a forEach just in case we have multiple.
      patchNodeInTree(payload, child);
    });
  }),
  // updateProjectName: thunk((actions, payload) => {
  //   const { projectId, name, rootObjectId } = payload;
  //   actions.setProjectName(payload);
  //   debounce(
  //     () => {
  //       return BaseAPIServices.post(`/api/v1.0/project`, {
  //         projectId,
  //         name,
  //       })
  //         .then(() => actions.setSnackMessage("✅ Saved title"))
  //         .catch((reason) => actions.setErrorProject(reason));
  //     },
  //     1000,
  //     "updateVSMTitle"
  //   );
  //   if (rootObjectId) {
  //     // Update the root object with the name as well
  //     debounce(
  //       () => {
  //         return BaseAPIServices.patch(`/api/v1.0/VSMObject`, {
  //           id: rootObjectId,
  //           name,
  //         }).catch((reason) => actions.setErrorProject(reason));
  //       },
  //       1000,
  //       "updateVSMObject"
  //     );
  //   }
  // }),
  // setProjectName: action((state, payload) => {
  //   state.project.name = payload.name;
  //   //Update our root node ( Null check that we actually have some children)
  //   if (state.project.objects?.length > 0) {
  //     state.project.objects[0].name = payload.name;
  //   }
  // }),
  deleteVSMObject: thunk(async (actions, payload) => {
    const { id, projectId } = payload;

    if (canDeleteVSMObject(payload)) {
      BaseAPIServices.delete(`/api/v1.0/VSMObject/${id}`)
        .then(() => {
          // Todo: delete the object locally
          //  Until then, just refresh the whole project
          actions.fetchProject({ id: projectId });
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

    const { object, task } = payload;
    const { projectId, id } = object;
    const { id: taskId } = task;

    // const { projectId, id, taskId } = payload;
    //Not really deleting, but rather unlinking the task.
    BaseAPIServices.delete(`/api/v1.0/task/unlink/${id}/${taskId}`, payload)
      .then(() => {
        actions.setSnackMessage("✅ Unlinked task!");
        // actions.removeTaskFromSelectedObject(response.data);
        actions.removeTaskFromSelectedObject(id);
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

    const { projectId, id, taskId, task } = payload;
    //Not really deleting, but rather unlinking the task.
    BaseAPIServices.put(`/api/v1.0/task/link/${id}/${taskId}`, payload)
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
  addObject: thunk(async (actions, newObject) => {
    //We need to update the newObject in the API, but the Parent (with the newObject) in our local state
    const apiObject = {
      ...newObject,
      id: newObject.id ?? 0, // use 0 when it is a new card
    } as vsmObject;

    actions.setSnackMessage("Adding new card...");
    BaseAPIServices.post(`/api/v1.0/VSMObject`, apiObject)
      .then((response) => {
        actions.setSnackMessage("Card added!");
        //Todo: local update with response object instead of fetching the whole project again
        actions.fetchProject({ id: response.data.projectId });
      })
      .catch((reason) => {
        actions.setSnackMessage(reason);
        return actions.setErrorProject(reason);
      });
  }),
  // updateVSMObject: thunk(async (actions, payload) => {
  //   actions.patchLocalObject(payload);
  //   actions.setErrorProject(null);

  //   // We store the VSM title in the name-field and in the root-node.
  //   // So if the process ( aka the root node ) title is updated, let's update the vsm title as well.
  //   // ** Update project title if type is process **
  //   const { projectId, name, vsmObjectType } = payload;
  //   if (vsmObjectType?.pkObjectType === vsmObjectTypes.process) {
  //     actions.setProjectName(payload);
  //     debounce(
  //       () => {
  //         return BaseAPIServices.post(`/api/v1.0/project`, {
  //           projectId,
  //           name,
  //         })
  //           .then(() => actions.setSnackMessage("✅ Saved title"))
  //           .catch((reason) => {
  //             actions.setSnackMessage(reason);
  //             return actions.setErrorProject(reason);
  //           });
  //       },
  //       1000,
  //       "updateVSMTitle"
  //     );
  //   }

  //   // Send the object-update to api
  //   debounce(
  //     () => {
  //       return BaseAPIServices.patch(`/api/v1.0/VSMObject`, payload)
  //         .then(() => actions.setSnackMessage("✅ Saved"))
  //         .catch((reason) => {
  //           actions.setSnackMessage(reason);
  //           return actions.setErrorProject(reason);
  //         });
  //     },
  //     1000,
  //     "updateVSMObject"
  //   );
  // }),
  moveVSMObject: thunk(async (actions, newVsmObject) => {
    actions.setErrorProject(null);
    actions.setSnackMessage("⏳ Moving card...");

    const { projectId, id, parent, leftObjectId, choiceGroup } = newVsmObject;

    // Send the object-update to api
    return BaseAPIServices.patch(`/api/v1.0/VSMObject`, {
      projectId,
      id,
      parent,
      leftObjectId,
      choiceGroup,
    })
      .then(() => {
        actions.fetchProject({ id: projectId });
        actions.setSnackMessage("✅ Moved card!");
      })
      .catch((reason) => {
        actions.setSnackMessage(reason);
        return actions.setErrorProject(reason);
      });
  }),
};

const store = createStore(projectModel, {
  name: "project",
});
export default store;
