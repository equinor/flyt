import { useStoreDispatch } from "@/hooks/storeHooks";
import { useProjectId } from "@/hooks/useProjectId";
import { patchGraph } from "@/services/graphApi";
import { notifyOthers } from "@/services/notifyOthers";
import { NodeDataCommon } from "@/types/NodeData";
import { UpdateNodeData, UpdateNodeDataRequestBody } from "@/types/NodeDataApi";
import { Unit } from "@/types/NodeInput";
import { debounce } from "@/utils/debounce";
import { unknownErrorToString } from "@/utils/isError";
import { useAccount, useMsal } from "@azure/msal-react";
import { useState } from "react";
import { useMutation, useQueryClient } from "react-query";

export const useNodeUpdate = (selectedNode: NodeDataCommon) => {
  const { accounts } = useMsal();
  const account = useAccount(accounts[0] || {});
  const [nodeInputData, setNodeInputData] = useState<UpdateNodeData>({});
  const [lastSentValues, setLastSentValues] = useState<UpdateNodeData>({});
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
    value?: string | number | null | undefined
  ) => {
    if (!nodeInputData[field] && value) return;
    debounce(() => {
      setLastSentValues((prevState) => {
        return {
          ...prevState,
          [field]: value,
        };
      });
      mutate({
        [field]: value,
        id: selectedNode.id,
      }),
        1500,
        `update ${field} - ${selectedNode.id}`;
    });
  };

  const handleInputChange = (
    value: string | number | null | undefined,
    field: "description" | "role" | "duration" | "unit"
  ) => {
    setNodeInputData((prevState) => {
      return {
        ...prevState,
        [field]: value ?? "",
      };
    });
    patchNode(field, value);
  };

  return { patchNode, error, handleInputChange, lastSentValues };
};
