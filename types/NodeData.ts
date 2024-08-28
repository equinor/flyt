import { NodeDataApi } from "./NodeDataApi";
import { timeDefinitions } from "../utils/unitDefinitions";

export type NodeData = {
  parents: string[];
  isDropTarget?: boolean;
  isValidDropTarget?: boolean;
  columnId: string | null;
  mergeOption?: boolean;
  handleMerge?: (sourceId: string | null, targetId: string | null) => void;
  handleClickNode?: () => void;
  mergeable?: boolean;
  merging?: boolean;
  userCanEdit?: boolean;
  depth?: number;
  isChoiceChild?: boolean;
  shapeHeight: number;
  shapeWidth: number;
  totalDurations?: {
    minTotalDuration: typeof timeDefinitions;
    maxTotalDuration: typeof timeDefinitions;
  };
} & NodeDataApi;

export type NodeDataHidden = Pick<
  NodeData,
  | "columnId"
  | "parents"
  | "depth"
  | "children"
  | "merging"
  | "isValidDropTarget"
  | "isDropTarget"
  | "mergeOption"
  | "isChoiceChild"
  | "shapeHeight"
  | "shapeWidth"
>;

export type NodeDataFull = NodeData | NodeDataHidden;
