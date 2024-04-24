import { Action, action, createStore, Thunk, thunk } from "easy-peasy";
import BaseAPIServices from "../services/BaseAPIServices";
import { Project } from "../types/Project";
import { NodeDataApi } from "../types/NodeDataApi";
import { Task } from "../types/Task";
import { canDeleteNode } from "../utils/canDeleteNode";
import { original } from "immer";
// General pattern Thunk -> Actions -> Set state

export type ProjectModel = {
  ///// STORE VARIABLES ///////////////
  errorProject: Record<string, unknown>;
  fetchingProject: boolean;
  project: Project;
  snackMessage: string | null;
  selectedNode: NodeDataApi | null;
  //// ACTIONS ///////////////////
  //someAction: Action<model, payload>;
  addTaskToselectedNode: Action<ProjectModel, Task>;
  updateTaskDescriptionInselectedNode: Action<ProjectModel, Task>;
  removeTaskFromselectedNode: Action<ProjectModel, string>;
  setselectedNode: Action<ProjectModel, NodeDataApi | null>;
  patchLocalObject: Action<ProjectModel, NodeDataApi>;
  setErrorProject: Action<ProjectModel, Record<string, unknown>>;
  setFetchingProject: Action<ProjectModel, boolean>;
  setProject: Action<ProjectModel, Project>;
  //setProjectName: Action<ProjectModel, { name?: string }>;
  setSnackMessage: Action<ProjectModel, string>;
  //// THUNKS ///////////////////
  //someThunk: Thunk<Model,Payload,Injections,StoreModel,Result>;
  addObject: Thunk<ProjectModel, NodeDataApi>;
  moveVSMObject: Thunk<
    ProjectModel,
    { projectId; id; parent; leftObjectId; choiceGroup }
  >;
  deleteVSMObject: Thunk<ProjectModel, NodeDataApi>;
  fetchProject: Thunk<ProjectModel, { id: string | string[] | number }>;
  // updateProjectName: Thunk<
  //   ProjectModel,
  //   { projectId: number; name: string; rootObjectId: number }
  // >;
  //updateVSMObject: Thunk<ProjectModel, vsmObject>;
  addTask: Thunk<ProjectModel, Task>;
  updateTask: Thunk<ProjectModel, Task>;
  linkTask: Thunk<
    ProjectModel,
    { projectId: number; id: number; taskId: number; task: Task }
  >;
  unlinkTask: Thunk<ProjectModel, { task: Task; object: NodeDataApi }>;
};

const projectModel: ProjectModel = {
  //State
  fetchingProject: false,
  errorProject: null,
  project: null,
  snackMessage: null,
  selectedNode: null,

  // selectedNode: computed((state) => {
  //   const { project, selectedNodeId } = state;
  //
  // }),

  //Actions
  addTaskToselectedNode: action((state, payload) => {
    const { selectedNode } = state;
    if (selectedNode) {
      selectedNode.tasks = [...selectedNode.tasks, payload];
    }
  }),
  updateTaskDescriptionInselectedNode: action((state, newTask) => {
    const { selectedNode } = state;
    if (selectedNode && selectedNode.tasks) {
      const oldTask = selectedNode.tasks.find((t) => t.id === newTask.id);
      if (oldTask) oldTask.description = newTask.description;
    }
  }),
  removeTaskFromselectedNode: action((state, taskId) => {
    const { selectedNode } = state;
    selectedNode.tasks = original(selectedNode.tasks).filter(
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
  setProject: action((state, payload: Project) => {
    state.project = payload;
  }),
  setselectedNode: action((state, payload) => {
    state.selectedNode = payload;
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

    function patchNode(oldObj: NodeDataApi, newObj: NodeDataApi) {
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
    function patchNodeInTree(node: NodeDataApi, tree: NodeDataApi) {
      if (node.id === tree.id) patchNode(tree, node);
      tree.children?.forEach((id) => {
        patchNodeInTree(
          node,
          state.project.objects.find((vsmObj: NodeDataApi) => vsmObj.id === id)
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

    if (canDeleteNode(payload)) {
      BaseAPIServices.delete(`/api/v1.0/VSMObject/${id}`)
        .then(() => {
          // Todo: delete the object locally
          //  Until then, just refresh the whole project
          actions.fetchProject({ id: projectId });
          actions.setselectedNode(null);
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

        actions.addTaskToselectedNode(response.data);

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

        actions.updateTaskDescriptionInselectedNode(response.data);

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
        // actions.removeTaskFromselectedNode(response.data);
        actions.removeTaskFromselectedNode(id);
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
        // actions.removeTaskFromselectedNode(response.data);
        //Todo: a
        actions.addTaskToselectedNode(task);

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
    } as NodeDataApi;

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
