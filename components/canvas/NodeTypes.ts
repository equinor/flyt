// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { MainActivityCard } from "./MainActivityCard";
import { GenericCard } from "./GenericCard";
import { SubActivityCard } from "./SubActivityCard";
import { ChoiceCard } from "./ChoiceCard";
import { WaitingCard } from "./WaitingCard";
import { RootCard } from "./RootCard";
import { EmptyCard } from "./EmptyCard";
import { NodeTypes } from "reactflow";

export const nodeTypes: NodeTypes = {
  Root: RootCard,
  Empty: EmptyCard,
  Supplier: GenericCard,
  Input: GenericCard,
  MainActivity: MainActivityCard,
  Output: GenericCard,
  Customer: GenericCard,
  SubActivity: SubActivityCard,
  Waiting: WaitingCard,
  Choice: ChoiceCard,
};
