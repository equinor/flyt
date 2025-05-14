import { useStoreDispatch } from "@/hooks/storeHooks";
import { useProjectId } from "@/hooks/useProjectId";
import { patchGraph } from "@/services/graphApi";
import { notifyOthers } from "@/services/notifyOthers";
import { NodeDataCommon } from "@/types/NodeData";
import { debounce } from "@/utils/debounce";
import { unknownErrorToString } from "@/utils/isError";
import { useAccount, useMsal } from "@azure/msal-react";
import { useState } from "react";
import { useMutation, useQueryClient } from "react-query";

export const useNodeUpdate = (selectedNode: NodeDataCommon) => {
  const { accounts } = useMsal();
  const account = useAccount(accounts[0] || {});
  const [description, setdescription] = useState<string>();

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
    mutate({
      ...selectedNode,
      ...updates,
      id: selectedNode.id,
    });
  };

  const patchDescription = () => patchNode(selectedNode, { description });
  const patchDurationRole = (value: {
    role?: string;
    duration?: number | null;
    unit?: string | null;
  }) => patchNode(selectedNode, { ...value });
  return { patchDescription, patchDurationRole, error, setdescription };
};
