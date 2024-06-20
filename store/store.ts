import { Action, action, createStore, Thunk, thunk } from "easy-peasy";
import BaseAPIServices from "../services/BaseAPIServices";
import { Project } from "@/types/Project";
import { NodeData } from "@/types/NodeData";
import { Task } from "@/types/Task";
import { canDeleteNode } from "@/utils/canDeleteNode";
import { original } from "immer";
// General pattern Thunk -> Actions -> Set state

export type ProjectModel = {
  ///// STORE VARIABLES ///////////////
  errorProject: Record<string, unknown>;
  fetchingProject: boolean;
  project: Project;
  snackMessage: string | null;
  selectedNode: NodeData | null;
  //// ACTIONS ///////////////////
  //someAction: Action<model, payload>;
  addTaskToSelectedNode: Action<ProjectModel, Task>;
  updateTaskDescriptionInselectedNode: Action<ProjectModel, Task>;
  removeTaskFromSelectedNode: Action<ProjectModel, string>;
  setSelectedNode: Action<ProjectModel, NodeData | null>;
  setErrorProject: Action<ProjectModel, Record<string, unknown>>;
  setFetchingProject: Action<ProjectModel, boolean>;
  setProject: Action<ProjectModel, Project>;
  //setProjectName: Action<ProjectModel, { name?: string }>;
  setSnackMessage: Action<ProjectModel, string>;
  //// THUNKS ///////////////////
  //someThunk: Thunk<Model,Payload,Injections,StoreModel,Result>;
  moveVSMObject: Thunk<
    ProjectModel,
    {
      projectId: any;
      id: any;
      parent: any;
      leftObjectId: any;
      choiceGroup: any;
    }
  >;
  deleteVSMObject: Thunk<ProjectModel, NodeData>;
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
  unlinkTask: Thunk<ProjectModel, { task: Task; object: NodeData }>;
};

const projectModel: ProjectModel = {
  //State
  fetchingProject: false,
  errorProject: {},
  project: {} as Project,
  snackMessage: null,
  selectedNode: null,

  // selectedNode: computed((state) => {
  //   const { project, selectedNodeId } = state;
  //
  // }),

  //Actions
  addTaskToSelectedNode: action((state, payload) => {
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
  removeTaskFromSelectedNode: action((state, taskId) => {
    const { selectedNode } = state;
    if (selectedNode?.tasks) {
      const filteredTasks = original(selectedNode.tasks)?.filter(
        (t) => t?.id !== taskId
      );
      if (filteredTasks) selectedNode.tasks = filteredTasks;
    }
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
  setSelectedNode: action((state, payload) => {
    state.selectedNode = payload;
  }),
  fetchProject: thunk(async (actions, payload) => {
    const { id } = payload;
    actions.setFetchingProject(true);
    actions.setErrorProject({});
    BaseAPIServices.get(`/api/v1.0/project/${id}`)
      .then((value) => actions.setProject(value.data))
      .catch((reason) => {
        actions.setSnackMessage(reason);
        return actions.setErrorProject(reason);
      })
      .finally(() => actions.setFetchingProject(false));
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
          actions.setSelectedNode(null);
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
    actions.setErrorProject({});
    BaseAPIServices.post(`/api/v1.0/task`, payload)
      .then((response) => {
        actions.setSnackMessage("✅ Task added!");

        actions.addTaskToSelectedNode(response.data);

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
    actions.setErrorProject({});
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
    actions.setErrorProject({});

    const { object, task } = payload;
    const { projectId, id } = object;
    const { id: taskId } = task;

    // const { projectId, id, taskId } = payload;
    //Not really deleting, but rather unlinking the task.
    BaseAPIServices.delete(`/api/v1.0/task/unlink/${id}/${taskId}`, payload)
      .then(() => {
        actions.setSnackMessage("✅ Unlinked task!");
        // actions.removeTaskFromselectedNode(response.data);
        actions.removeTaskFromSelectedNode(id);
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
    actions.setErrorProject({});

    const { projectId, id, taskId, task } = payload;
    //Not really deleting, but rather unlinking the task.
    BaseAPIServices.put(`/api/v1.0/task/link/${id}/${taskId}`, payload)
      .then(() => {
        actions.setSnackMessage("✅ Linked task!");
        // actions.removeTaskFromselectedNode(response.data);
        //Todo: a
        actions.addTaskToSelectedNode(task);

        //Todo: locally update before api-update?
        actions.fetchProject({ id: projectId });
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
    actions.setErrorProject({});
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
