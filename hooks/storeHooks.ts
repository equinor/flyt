import { createTypedHooks } from 'easy-peasy';
import { ProjectModel } from '../store/store';

const typedHooks = createTypedHooks<ProjectModel>();

export const useStoreActions = typedHooks.useStoreActions;
export const useStoreDispatch = typedHooks.useStoreDispatch;
export const useStoreState = typedHooks.useStoreState;
