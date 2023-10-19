import { Position } from "reactflow";
import { vsmObject } from "./VsmObject";

export type NodeData = {
  parentCardIDs: string[];
  isDropTarget?: boolean;
  isValidDropTarget?: boolean | null;
  columnId: string | null;
  mergeOption?: boolean;
  handleMerge: (sourceId: string | null, targetId: string | null) => void;
  handleClickCard: () => void;
  handleClickAddCard: (arg0: string, arg1: string, arg2: Position) => void;
  mergeable?: boolean;
  merging?: boolean;
  userCanEdit?: boolean;
  depth?: number;
  isChoiceChild?: boolean;
} & vsmObject;

export type NodeDataFiller = Pick<
  NodeData,
  "columnId" | "parentCardIDs" | "depth" | "children" | "merging"
>;

export type NodeDataFull = NodeData | NodeDataFiller;
