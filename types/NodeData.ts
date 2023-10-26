import { Position } from "reactflow";
import { vsmObject } from "./VsmObject";
import { vsmObjectTypes } from "./vsmObjectTypes";

export type NodeData = {
  parents: string[];
  isDropTarget?: boolean;
  isValidDropTarget?: boolean | null;
  columnId: string | null;
  mergeOption?: boolean;
  handleMerge: (sourceId: string | null, targetId: string | null) => void;
  handleClickCard: () => void;
  handleClickAddCard: (
    nodeId: string,
    type: vsmObjectTypes,
    position: Position
  ) => void;
  mergeable?: boolean;
  merging?: boolean;
  userCanEdit?: boolean;
  depth?: number;
  isChoiceChild?: boolean;
} & vsmObject;

export type NodeDataFiller = Pick<
  NodeData,
  "columnId" | "parents" | "depth" | "children" | "merging"
>;

export type NodeDataFull = NodeData | NodeDataFiller;
