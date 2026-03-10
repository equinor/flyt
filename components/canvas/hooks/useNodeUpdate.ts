import { useStoreDispatch } from "@/hooks/storeHooks";
import { useProjectId } from "@/hooks/useProjectId";
import { patchGraph } from "@/services/graphApi";
import { notifyOthers } from "@/services/notifyOthers";
import { NodeDataCommon } from "@/types/NodeData";
import { UpdateNodeData, UpdateNodeDataRequestBody } from "@/types/NodeDataApi";
import { Unit } from "@/types/NodeInput";
import { unknownErrorToString } from "@/utils/isError";
import { useAccount, useMsal } from "@azure/msal-react";
import { useState } from "react";
import { useMutation, useQueryClient } from "react-query";

export const useNodeUpdate = (selectedNode: NodeDataCommon) => {
  const { accounts } = useMsal();
  const account = useAccount(accounts[0] || {});
  const [nodeInputData, setNodeInputData] = useState<UpdateNodeData>({});

  const { projectId } = useProjectId();
  const dispatch = useStoreDispatch();
  const queryClient = useQueryClient();
  const { mutate, error } = useMutation(
    (patchedObject: UpdateNodeDataRequestBody) =>
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
    field: "description" | "role" | "duration" | "unit",
    value?: string | null
  ) => {
    const newValue = field === Unit ? value : nodeInputData[field];
    if (!newValue) return;
    mutate({
      [field]: newValue,
      id: selectedNode.id,
    });
  };

  const handleInputChange = (
    value: string | number | null | undefined,
    field: string
  ) => {
    setNodeInputData((prevState) => {
      return {
        ...prevState,
        [field]: value ?? "",
      };
    });
  };

  return { patchNode, error, handleInputChange };
};
