import { useAccount, useMsal } from "@azure/msal-react";
import { useMutation, useQueryClient } from "react-query";
import { getNodeTypeName } from "@/utils/getNodeTypeName";
import { notifyOthers } from "@/services/notifyOthers";
import { unknownErrorToString } from "@/utils/isError";
import { useStoreDispatch } from "hooks/storeHooks";
import { NodeDataInteractable } from "@/types/NodeData";
import { NodeTypes } from "@/types/NodeTypes";
import { deleteVertice } from "services/graphApi";
import { useProjectId } from "@/hooks/useProjectId";
import { ScrimDelete } from "./ScrimDelete";

export function DeleteNodeDialog(props: {
  objectToDelete: NodeDataInteractable;
  onClose: () => void;
  visible: boolean;
}) {
  const { accounts } = useMsal();
  const account = useAccount(accounts[0] || {});

  const { projectId } = useProjectId();
  const dispatch = useStoreDispatch();
  const queryClient = useQueryClient();
  const { choice, mainActivity, subActivity, waiting } = NodeTypes;

  const deleteMutation = useMutation(
    ({
      id,
      projectId,
      includeChildren,
    }: {
      id: string;
      projectId: string;
      includeChildren: boolean;
    }) => deleteVertice(id, projectId, includeChildren),
    {
      onSuccess() {
        handleClose();
        void notifyOthers("Deleted a card", projectId, account);
        return queryClient.invalidateQueries();
      },
      onError: (e: Error | null) =>
        dispatch.setSnackMessage(unknownErrorToString(e)),
    }
  );

  if (!props.visible) return null;

  const handleClose = () => props.onClose();
  const handleDelete = (includeChildren: boolean) =>
    deleteMutation.mutate({
      id: props.objectToDelete.id,
      projectId: props.objectToDelete.projectId,
      includeChildren: includeChildren,
    });

  const { type } = props.objectToDelete;

  const header = `Delete ${getNodeTypeName(type).toLowerCase()}`;
  let warningMessage = "This will delete the selected card";
  let checkboxMessage = undefined;
  if (type === mainActivity) {
    warningMessage =
      "This will delete all of its following cards.\nAre you sure you want to proceed?";
  } else if (type === choice) {
    warningMessage =
      "This will delete all connected alternatives.\nAre you sure you want to proceed?";
  } else if (type === subActivity || type === waiting) {
    checkboxMessage = "Delete all of its following cards";
  }
  const confirmMessage = "Delete";
  return (
    <ScrimDelete
      id={props.objectToDelete.id}
      open
      header={header}
      onClose={handleClose}
      onConfirm={(_, includeChildren) => handleDelete(includeChildren)}
      error={deleteMutation.error}
      warningMessage={warningMessage}
      confirmMessage={confirmMessage}
      checkboxMessage={checkboxMessage}
      isLoading={deleteMutation.isLoading}
    />
  );
}
