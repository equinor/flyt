import { useEffect } from "react";
import { useMutation, useQueryClient } from "react-query";
import { ReactFlowState, useReactFlow, useStore } from "reactflow";
import { useStoreDispatch } from "../../../hooks/storeHooks";
import { mergeVertices } from "../../../services/graphApi";
import { notifyOthers } from "../../../services/notifyOthers";
import { unknownErrorToString } from "../../../utils/isError";
import { useUserAccount } from "./useUserAccount";

export type MergeNodeParams = {
  sourceId: string;
  targetId: string;
};

export const useNodeMerge = (projectId: string) => {
  const { getNodes, setNodes } = useReactFlow();
  const connectionNodeIdSelector = (state: ReactFlowState) =>
    state.connectionNodeId;
  const connectionNodeId = useStore(connectionNodeIdSelector);
  const dispatch = useStoreDispatch();
  const queryClient = useQueryClient();
  const account = useUserAccount();

  useEffect(() => {
    if (connectionNodeId) {
      initMerge(connectionNodeId);
    } else {
      cancelMerge();
    }
  }, [connectionNodeId]);

  const mutate = useMutation(
    (params: MergeNodeParams) => {
      const { sourceId, targetId } = params;
      if (!sourceId || !targetId) {
        throw new Error("Could not connect nodes");
      }
      return mergeVertices(
        { fromVertexId: sourceId, toVertexId: targetId },
        projectId
      );
    },
    {
      onSuccess: () => {
        dispatch.setSnackMessage("✅ Cards merged!");
        notifyOthers("Merged cards", projectId, account);
        queryClient.invalidateQueries();
      },
      onError: (e) => dispatch.setSnackMessage(unknownErrorToString(e)),
    }
  );

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
            !sourceNode.data.children.find(
              (childId: string) => childId === node.id
            ) &&
            !sourceNode.data.parents.find(
              (parentId: string) => parentId === node.id
            ),
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

  return { mutate, merging: !!connectionNodeId };
};
