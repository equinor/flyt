import { useNodes } from "reactflow";
import { useSelectedNodeForPQIRid } from "./useSelectedNodeForPQIRid";
import { NodeDataCommon } from "@/types/NodeData";

export const useSelectedNodeForPQIR = () => {
  const nodes = useNodes<NodeDataCommon>();
  const { selectedNodeForPQIRid } = useSelectedNodeForPQIRid();
  const id = selectedNodeForPQIRid;
  return nodes.find((node) => node.id === id);
};
