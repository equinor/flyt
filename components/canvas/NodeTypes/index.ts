import { NodeTypes } from "reactflow";
import { MainActivityCard } from "./MainActivityCard";
import { GenericCard } from "./GenericCard";
import { SubActivityCard } from "./SubActivityCard";
import { ChoiceCard } from "./ChoiceCard";
import { WaitingCard } from "./WaitingCard";
import { RootCard } from "./RootCard";

const nodeTypes: NodeTypes = {
  rootCard: RootCard,
  1: GenericCard, // Process
  2: GenericCard, // Supplier
  3: GenericCard, // Input
  4: MainActivityCard,
  5: SubActivityCard,
  7: WaitingCard,
  8: GenericCard, // Output
  9: GenericCard, // Customer
  10: ChoiceCard,
};

export default nodeTypes;
