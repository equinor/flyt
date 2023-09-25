import { Position } from "reactflow";
import { vsmObject } from "./VsmObject";

export type NodeData = {
  parentCardIDs?: Array<string>;
  isDropTarget?: boolean;
  isValidDropTarget?: boolean;
  columnId?: string;
  mergeOption?: boolean;
  handleConfirmMerge?: (sourceId: string, targetId: string) => void;
  handleClickCard?: () => void;
  handleClickAddCard?: (arg0: string, arg1: string, arg2: Position) => void;
  mergeable?: boolean;
  merging?: boolean;
  userCanEdit?: boolean;
  depth?: number;
  isChoiceChild?: boolean;
} & vsmObject;
