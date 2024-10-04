import { NodeDataApi } from "./NodeDataApi";
import { NodeTypes } from "./NodeTypes";
import { TimeDefinition } from "./TimeDefinition";

export type Column = {
  id: string;
  firstNodeType: NodeTypes;
} | null;

export type NodeData = {
  parents: string[];
  isDropTarget?: boolean;
  isValidDropTarget?: boolean;
  column: Column;
  mergeOption?: boolean;
  handleMerge?: (sourceId: string | null, targetId: string | null) => void;
  handleClickNode?: () => void;
  mergeable?: boolean;
  merging?: boolean;
  userCanEdit?: boolean;
  depth?: number;
  parentTypes?: NodeTypes[];
  shapeHeight: number;
  shapeWidth: number;
  totalDurations?: {
    minTotalDuration: TimeDefinition[];
    maxTotalDuration: TimeDefinition[];
  };
  disabled?: boolean;
};

export type NodeDataCommon = NodeData & NodeDataApi;

export type NodeDataHidden = Pick<
  NodeData,
  | "column"
  | "parents"
  | "depth"
  | "merging"
  | "isValidDropTarget"
  | "isDropTarget"
  | "mergeOption"
  | "parentTypes"
  | "shapeHeight"
  | "shapeWidth"
> &
  Pick<NodeDataApi, "children">;

export type NodeDataFull = NodeDataCommon | NodeDataHidden;
