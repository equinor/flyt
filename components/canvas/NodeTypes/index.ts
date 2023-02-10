import { NodeTypes } from "reactflow";
import { MainActivityCard } from "./MainActivityCard";
import { GenericCard } from "./GenericCard";
import { SubActivityCard } from "./SubActivityCard";
import { ChoiceCard } from "./ChoiceCard";
import { WaitingCard } from "./WaitingCard";
import { RootCard } from "./RootCard";

const nodeTypes: NodeTypes = {
  Root: RootCard,
  Supplier: GenericCard,
  Input: GenericCard,
  MainActivity: MainActivityCard,
  Output: GenericCard,
  Customer: GenericCard,
  SubActivity: SubActivityCard,
  Waiting: WaitingCard,
  Choice: ChoiceCard,
};

export default nodeTypes;
