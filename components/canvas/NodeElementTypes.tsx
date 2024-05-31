import { MainActivityNode } from "./MainActivityNode";
import { GenericNode } from "./GenericNode";
import { SubActivityNode } from "./SubActivityNode";
import { ChoiceNode } from "./ChoiceNode";
import { WaitingNode } from "./WaitingNode";
import { RootNode } from "./RootNode";
import { HiddenNode } from "./HiddenNode";
import { NodeTypes } from "reactflow";

export const nodeElementTypes: NodeTypes = {
  Root: RootNode,
  Hidden: HiddenNode,
  Supplier: GenericNode,
  Input: GenericNode,
  MainActivity: MainActivityNode,
  Output: GenericNode,
  Customer: GenericNode,
  SubActivity: SubActivityNode,
  Waiting: WaitingNode,
  Choice: ChoiceNode,
};
