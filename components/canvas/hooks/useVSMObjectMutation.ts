import { useStoreDispatch } from "@/hooks/storeHooks";
import { useProjectId } from "@/hooks/useProjectId";
import { patchGraph } from "@/services/graphApi";
import { notifyOthers } from "@/services/notifyOthers";
import { NodeDataCommon } from "@/types/NodeData";
import { debounce } from "@/utils/debounce";
import { unknownErrorToString } from "@/utils/isError";
import { useAccount, useMsal } from "@azure/msal-react";
import { useMutation, useQueryClient } from "react-query";

export const useVSMObjectMutation = (selectedNode: NodeDataCommon) => {
  const { accounts } = useMsal();
  const account = useAccount(accounts[0] || {});

  const { projectId } = useProjectId();
  const dispatch = useStoreDispatch();
  const queryClient = useQueryClient();
  const { mutate, error } = useMutation(
    (patchedObject: NodeDataCommon) =>
      patchGraph(patchedObject, projectId, patchedObject.id),
    {
      onSuccess() {
        void notifyOthers("Updated a card", projectId, account);
        return queryClient.invalidateQueries();
      },
      onError: (e: Error | null) =>
        dispatch.setSnackMessage(unknownErrorToString(e)),
    }
  );

  const patchNode = (
    selectedNode: NodeDataCommon,
    updates: {
      description?: string;
      role?: string;
      duration?: number | null;
      unit?: string | null;
    }
  ) => {
    debounce(
      () => {
        mutate({
          ...selectedNode,
          ...updates,
          id: selectedNode.id,
        });
      },
      1500,
      `update ${Object.keys(updates)[0]} - ${selectedNode.id}`
    );
  };

  const patchDescription = (description?: string) =>
    patchNode(selectedNode, { description });
  const patchDuration = (duration: number | null, unit: string | null) =>
    patchNode(selectedNode, { duration, unit });
  const patchRole = (role: string) => patchNode(selectedNode, { role });
  return { patchDescription, patchDuration, patchRole, error };
};
