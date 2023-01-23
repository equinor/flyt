import { vsmObject } from "./VsmObject";

export type NodeData = {
  card?: vsmObject;
  isDropTarget?: boolean;
  isValidDropTarget?: boolean;
  columnId?: number;
  onClickMergeButton?: (arg0: number) => void;
  mergeOption?: boolean;
  mergeInitiator?: boolean;
  confirmMerge?: (arg0: string) => void;
  cancelMerge?: (arg0: number) => void;
  onClickMergeOption?: () => void;
  handleClick?: () => void;
  mergeable?: boolean;
};
