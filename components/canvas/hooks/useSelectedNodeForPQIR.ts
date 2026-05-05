import { useReactFlow } from "@xyflow/react";
import { useSelectedNodeForPQIRid } from "./useSelectedNodeForPQIRid";

export const useSelectedNodeForPQIR = () => {
  const flow = useReactFlow();
  const { selectedNodeForPQIRid } = useSelectedNodeForPQIRid();
  if (selectedNodeForPQIRid) {
    const nodes = flow.getNodes();
    return nodes.find((node) => node.id === selectedNodeForPQIRid);
  }
};
