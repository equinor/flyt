import { vsmObject } from "./VsmObject";

export type NodeData = {
  card?: vsmObject;
  parentCard?: vsmObject;
  isDropTarget?: boolean;
  isValidDropTarget?: boolean;
  columnId?: string;
  handleClickMergeInit?: (arg0: string) => void;
  mergeOption?: boolean;
  mergeInitiator?: boolean;
  handleClickConfirmMerge?: (arg0: string) => void;
  handleClickCancelMerge?: (arg0: string) => void;
  handleClickMergeOptionCheckbox?: () => void;
  handleClickCard?: () => void;
  handleClickAddCard?: (arg0: string, arg1: string) => void;
  mergeable?: boolean;
};
