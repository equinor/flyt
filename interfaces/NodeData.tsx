import { vsmObject } from "./VsmObject";

export type NodeData = {
  card?: vsmObject;
  isDropTarget?: boolean;
  isValidDropTarget?: boolean;
  columnId?: number;
  handleClickMergeInit?: (arg0: number) => void;
  mergeOption?: boolean;
  mergeInitiator?: boolean;
  handleClickConfirmMerge?: (arg0: string) => void;
  handleClickCancelMerge?: (arg0: number) => void;
  handleClickMergeOptionCheckbox?: () => void;
  handleClickCard?: () => void;
  mergeable?: boolean;
  isChoiceChild: boolean;
};
