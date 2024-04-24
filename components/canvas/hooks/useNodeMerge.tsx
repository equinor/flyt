import { useEffect } from "react";
import { ReactFlowState, useReactFlow, useStore } from "reactflow";

export const useNodeMerge = () => {
  const { getNodes, setNodes } = useReactFlow();
  const connectionNodeIdSelector = (state: ReactFlowState) =>
    state.connectionNodeId;
  const connectionNodeId = useStore(connectionNodeIdSelector);

  useEffect(() => {
    if (connectionNodeId) {
      initMerge(connectionNodeId);
    } else {
      cancelMerge();
    }
  }, [connectionNodeId]);

  const initMerge = (nodeId: string) => {
    const sourceNode = getNodes().find((node) => node.id === nodeId);
    setNodes((nodes) =>
      nodes.map((node) => {
        node.data = {
          ...node.data,
          mergeOption:
            sourceNode &&
            sourceNode.id !== node.id &&
            node.data.columnId == sourceNode?.data?.columnId &&
            !sourceNode.data.children.find((childId) => childId === node.id) &&
            !sourceNode.data.parents.find((parentId) => parentId === node.id),
        };
        node.data.merging = true;
        return node;
      })
    );
  };

  const cancelMerge = () => {
    setNodes((nodes) =>
      nodes.map((node) => {
        node.data = { ...node.data, mergeOption: false, merging: false };
        return node;
      })
    );
  };

  return { merging: !!connectionNodeId };
};
