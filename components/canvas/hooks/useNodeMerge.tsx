import { useEffect } from "react";
import { useMutation, useQueryClient } from "react-query";
import { useConnection, useReactFlow, Node } from "@xyflow/react";
import { useStoreDispatch } from "@/hooks/storeHooks";
import { mergeVertices } from "@/services/graphApi";
import { notifyOthers } from "@/services/notifyOthers";
import { unknownErrorToString } from "@/utils/isError";
import { useUserAccount } from "./useUserAccount";
import { useProjectId } from "@/hooks/useProjectId";
import { NodeDataFull } from "@/types/NodeData";
import { NodeTypes } from "@/types/NodeTypes";
import { EdgeLabel } from "../EdgeLabel";

export type NodeMergeParams = {
  sourceId: string;
  targetId: string;
};

export const useNodeMerge = () => {
  const { getNodes, setNodes } = useReactFlow<Node<NodeDataFull>>();
  const { projectId } = useProjectId();
  const connectionNodeId = useConnection(
    (connection) => connection.fromHandle?.nodeId ?? null
  );
  const dispatch = useStoreDispatch();
  const queryClient = useQueryClient();
  const account = useUserAccount();

  const mutate = useMutation(
    ({ sourceId, targetId }: NodeMergeParams) => {
      if (!sourceId || !targetId) {
        throw new Error("Could not connect nodes");
      }
      return mergeVertices(
        {
          fromVertexId: sourceId,
          toVertexId: targetId,
          label: "ConnectedLineEdge",
        },
        projectId
      );
    },
    {
      onSuccess: () => {
        dispatch.setSnackMessage("✅ Cards merged!");
        notifyOthers("Merged cards", projectId, account);
        queryClient.invalidateQueries();
      },
      onError: (e: Error | null) =>
        dispatch.setSnackMessage(unknownErrorToString(e)),
    }
  );

  const initMerge = (nodeId: string) => {
    const sourceNode = getNodes().find((node) => node.id === nodeId);
    setNodes((nodes) =>
      nodes.map((node) => ({
        ...node,
        data: {
          ...node.data,
          mergeOption:
            !!sourceNode &&
            sourceNode.id !== node.id &&
            node.data.column?.id === sourceNode.data.column?.id &&
            !sourceNode.data.children.find((childId) => childId === node.id) &&
            !sourceNode.data.parents.find((parentId) => parentId === node.id),
          merging: true,
        },
      }))
    );
  };

  const cancelMerge = () => {
    setNodes((nodes) =>
      nodes.map((node) => ({
        ...node,
        data: { ...node.data, mergeOption: false, merging: false },
      }))
    );
  };

  useEffect(() => {
    if (connectionNodeId) {
      initMerge(connectionNodeId);
    } else {
      cancelMerge();
    }
  }, [connectionNodeId]);

  return { mutate, merging: !!connectionNodeId };
};
