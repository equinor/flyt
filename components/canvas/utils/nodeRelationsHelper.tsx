import { Column } from "@/types/NodeData";
import { NodeTypes } from "@/types/NodeTypes";

export const isChoiceChild = (parentTypes?: NodeTypes[]) =>
  parentTypes?.includes(NodeTypes.choice);

export const isMainActivityColumn = (column?: Column) =>
  column?.firstNodeType === NodeTypes.mainActivity;

export const isGenericColumn = (column: Column): boolean => {
  const genericNodeTypes = [
    NodeTypes.supplier,
    NodeTypes.input,
    NodeTypes.output,
    NodeTypes.customer,
  ];
  return (
    !!column?.firstNodeType && genericNodeTypes.includes(column.firstNodeType)
  );
};
