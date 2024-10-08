import { useAccount, useMsal } from "@azure/msal-react";
import { useMutation, useQueryClient } from "react-query";
import { getNodeTypeName } from "@/utils/getNodeTypeName";
import { notifyOthers } from "@/services/notifyOthers";
import { unknownErrorToString } from "@/utils/isError";
import { useStoreDispatch } from "hooks/storeHooks";
import { NodeData } from "@/types/NodeData";
import { NodeTypes } from "@/types/NodeTypes";
import { deleteVertice } from "services/graphApi";
import { useProjectId } from "@/hooks/useProjectId";
import { ScrimDelete } from "./ScrimDelete";

export function DeleteNodeDialog(props: {
  objectToDelete: NodeData;
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

  const { type, children } = props.objectToDelete;
  const hasChildren = children.length > 0;

  const header = `Delete ${getNodeTypeName(type).toLowerCase()}`;

  const getWarningMessage = () => {
    const typeIsMainActivityOrChoice = type === mainActivity || type === choice;

    if (typeIsMainActivityOrChoice && hasChildren) {
      return "This will delete **ALL** the cards below.\nAre you sure you want to proceed?";
    }
    return "This will delete the selected card";
  };

  const getCheckboxMessage = () => {
    if ((type === subActivity || type === waiting) && hasChildren) {
      return "Delete all of its following cards";
    }
  };

  const warningMessage = getWarningMessage();
  const checkboxMessage = getCheckboxMessage();

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
