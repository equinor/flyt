import { Action, action, createStore, persist, Thunk, thunk } from 'easy-peasy';
import BaseAPIServices from '../services/BaseAPIServices';
import { VsmProject } from '../interfaces/VsmProject';
import { vsmObject } from '../interfaces/VsmObject';
import { original } from 'immer';
import { debounce } from '../utils/debounce';

// General pattern Thunk -> Actions -> Set state

export interface ProjectModel {
  errorProject: object;
  fetchProject: Thunk<ProjectModel, { id: string | string[] | number }>;
  fetchingProject: boolean;
  project: VsmProject;
  setErrorProject: Action<ProjectModel, object>;
  setFetchingProject: Action<ProjectModel, boolean>;
  setProject: Action<ProjectModel, object>;
  updateVSMObject: Thunk<ProjectModel, vsmObject>;
  patchLocalObject: Action<ProjectModel, vsmObject>;
}

const projectModel: ProjectModel = {
  //State
  fetchingProject: false,
  errorProject: null,
  project: null,

  //Actions
  setFetchingProject: action((state, payload) => {
    state.fetchingProject = payload;
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
    BaseAPIServices
      .get(`/api/v1.0/project/${id}`)
      .then(value => actions.setProject(value.data))
      .catch(reason => actions.setErrorProject(reason))
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
      tree.childObjects.forEach(child => {
        patchNodeInTree(node, child);
      });
    }

    project.objects.forEach(child => {
      // We expect only one top level child, but adding a forEach just in case we have multiple...
      patchNodeInTree(payload, child);
    });

  }),
  updateVSMObject: thunk(async (actions, payload) => {
    actions.patchLocalObject(payload);
    const debounced = debounce(() => {
      return BaseAPIServices
        .patch(`/api/v1.0/VSMObject`, payload)
        .catch(reason => actions.setErrorProject(reason));
    }, 1000, 'updateVSMObject');
    debounced();
  }),
};

const store = createStore(
  persist(projectModel, {
    allow: ['project'],
  }),
);
export default store;
