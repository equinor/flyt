import { useReactFlow } from "reactflow";
import { useSelectedNodeForPQIRid } from "./useSelectedNodeForPQIRid";

export const useSelectedNodeForPQIR = () => {
  const flow = useReactFlow();
  const { selectedNodeForPQIRid } = useSelectedNodeForPQIRid();
  if (selectedNodeForPQIRid) {
    const nodes = flow.getNodes();
    return nodes.find((node) => node.id === selectedNodeForPQIRid);
  }
};
