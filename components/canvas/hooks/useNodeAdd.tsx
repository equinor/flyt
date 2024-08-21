import { useMutation, useQueryClient } from "react-query";
import { Position } from "reactflow";
import { NodeTypes } from "types/NodeTypes";
import { useStoreDispatch } from "@/hooks/storeHooks";
import {
  addVertice,
  addVerticeLeft,
  addVerticeRight,
} from "@/services/graphApi";
import { notifyOthers } from "@/services/notifyOthers";
import { unknownErrorToString } from "@/utils/isError";
import { useProjectId } from "@/hooks/useProjectId";
import { useUserAccount } from "./useUserAccount";
import { useState } from "react";

export type NodeAddParams = {
  parentId: string;
  type: NodeTypes;
  position: Position;
};

export const useNodeAdd = () => {
  const { projectId } = useProjectId();
  const dispatch = useStoreDispatch();
  const queryClient = useQueryClient();
  const account = useUserAccount();

  const [nodeAddingChild, setNodeAddingChild] = useState<{
    id: string;
    position: Position;
  } | null>(null);

  const mutation = useMutation(
    ({ parentId, type, position }: NodeAddParams) => {
      setNodeAddingChild({ id: parentId, position: position });
      dispatch.setSnackMessage("⏳ Adding new card...");
      switch (position) {
        case Position.Left:
          return addVerticeLeft({ type }, projectId, parentId);
        case Position.Right:
          return addVerticeRight({ type }, projectId, parentId);
        default:
          return addVertice({ type }, projectId, parentId);
      }
    },
    {
      onSuccess: () => {
        dispatch.setSnackMessage("✅ Card added!");
        notifyOthers("Added a new card", projectId, account);
        queryClient.invalidateQueries();
      },
      onError: (e: Error | null) =>
        dispatch.setSnackMessage(unknownErrorToString(e)),
      onSettled: () => setNodeAddingChild(null),
    }
  );

  const addNode = (parentId: string, type: NodeTypes, position: Position) =>
    mutation.mutate({ parentId, type, position });

  const isNodeButtonDisabled = (nodeId: string, position: Position) =>
    nodeAddingChild?.id === nodeId && nodeAddingChild?.position === position;

  return {
    addNode,
    isNodeButtonDisabled,
  };
};
