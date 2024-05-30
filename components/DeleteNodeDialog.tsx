import { useAccount, useMsal } from "@azure/msal-react";
import { useMutation, useQueryClient } from "react-query";
import { getNodeTypeName } from "../utils/getNodeTypeName";
import { notifyOthers } from "../services/notifyOthers";
import { unknownErrorToString } from "../utils/isError";
import { useStoreDispatch } from "hooks/storeHooks";
import { NodeDataApi } from "../types/NodeDataApi";
import { NodeTypes } from "../types/NodeTypes";
import { deleteVertice } from "services/graphApi";
import { useProjectId } from "../hooks/useProjectId";
import { ScrimDelete } from "./ScrimDelete";

export function DeleteNodeDialog(props: {
  objectToDelete: NodeDataApi;
  onClose: () => void;
  visible: boolean;
}): JSX.Element {
  const { accounts } = useMsal();
  const account = useAccount(accounts[0] || {});

  const { projectId } = useProjectId();
  const dispatch = useStoreDispatch();
  const queryClient = useQueryClient();
  const { choice, mainActivity } = NodeTypes;

  const deleteMutation = useMutation(
    ({
      id,
      projectId,
      type,
    }: {
      id: string;
      projectId: string;
      type: string;
    }) =>
      deleteVertice(id, projectId, type === mainActivity || type === choice),
    {
      onSuccess() {
        handleClose();
        notifyOthers("Deleted a card", projectId, account);
        return queryClient.invalidateQueries();
      },
      onError: (e) => dispatch.setSnackMessage(unknownErrorToString(e)),
    }
  );

  if (!props.visible) return null;

  const handleClose = () => props.onClose();
  const handleDelete = () =>
    deleteMutation.mutate({
      id: props.objectToDelete.id,
      projectId: props.objectToDelete.projectId,
      type: props.objectToDelete.type,
    });

  const { type } = props.objectToDelete;

  const header = `Delete ${getNodeTypeName(type).toLowerCase()}`;
  let warningMessage = "This will delete the selected card.";
  if (type === mainActivity) {
    warningMessage =
      "This will delete everything under it.\nAre you sure you want to proceed?";
  } else if (type === choice) {
    warningMessage =
      "This will delete all connected alternatives.\nAre you sure you want to proceed?";
  }
  const confirmMessage = "Delete";
  return (
    <ScrimDelete
      id={props.objectToDelete.id}
      open
      header={header}
      onClose={handleClose}
      onConfirm={handleDelete}
      error={deleteMutation.error}
      warningMessage={warningMessage}
      confirmMessage={confirmMessage}
      isLoading={deleteMutation.isLoading}
    />
  );
}
