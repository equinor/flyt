import { EdgeTypes } from "reactflow";
import { ChoiceEdge } from "@/components/canvas/ChoiceEdge";
import { DeletableEdge } from "./DeletableEdge";

export const edgeElementTypes: EdgeTypes = {
  choice: ChoiceEdge,
  deletable: DeletableEdge,
};
