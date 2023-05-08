import { Position } from "reactflow";
import { vsmObject } from "./VsmObject";

export type NodeData = {
  card?: vsmObject;
  parentCards?: Array<vsmObject>;
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
  handleClickAddCard?: (arg0: string, arg1: string, arg2: Position) => void;
  mergeable?: boolean;
  userCanEdit?: boolean;
};
