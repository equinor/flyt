import { Button, Icon, Scrim, Typography } from "@equinor/eds-core-react";
import { close as closeIcon, delete_forever } from "@equinor/eds-icons";
import { useAccount, useMsal } from "@azure/msal-react";
import { useMutation, useQueryClient } from "react-query";
import { getNodeTypeName } from "../utils/getNodeTypeName";
import { notifyOthers } from "../services/notifyOthers";
import styles from "../layouts/default.layout.module.scss";
import { unknownErrorToString } from "../utils/isError";
import { useRouter } from "next/router";
import { useStoreDispatch } from "hooks/storeHooks";
import { NodeDataApi } from "../types/NodeDataApi";
import { NodeTypes } from "../types/NodeTypes";
import { deleteVertice } from "services/graphApi";

export function DeleteNodeDialog(props: {
  objectToDelete: NodeDataApi;
  onClose: () => void;
  visible: boolean;
}): JSX.Element {
  const { accounts } = useMsal();
  const account = useAccount(accounts[0] || {});

  const router = useRouter();
  const { id } = router.query;
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
        notifyOthers("Deleted a card", id, account);
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

  const header = `Delete "${getNodeTypeName(type).toLowerCase()}"`;
  let warningMessage = "This will delete the selected object.";
  if (type === mainActivity) {
    warningMessage =
      "This will delete everything under it.\nAre you sure you want to proceed?";
  } else if (type === choice) {
    warningMessage =
      "This will delete all connected alternatives.\nAre you sure you want to proceed?";
  }
  const confirmMessage = "Delete";
  return (
    <Scrim open onClose={handleClose} isDismissable>
      <div className={styles.scrimWrapper}>
        {deleteMutation.isLoading ? (
          <Typography>Deleting...</Typography>
        ) : (
          <>
            <div className={styles.scrimHeaderWrapper}>
              <div className={styles.scrimTitle}>{header}</div>
              <Button autoFocus variant={"ghost_icon"} onClick={handleClose}>
                <Icon data={closeIcon} title="Close" />
              </Button>
            </div>
            <div className={styles.scrimContent}>
              {deleteMutation.error && (
                <Typography color={"warning"} variant={"h4"}>
                  {unknownErrorToString(deleteMutation.error)}
                </Typography>
              )}
              <Typography variant={"h4"}>{warningMessage}</Typography>
            </div>
            <div className={styles.deleteButton}>
              <Button
                variant={"contained"}
                color={"danger"}
                onClick={handleDelete}
              >
                <Icon data={delete_forever} title="Delete process" size={16} />
                {confirmMessage}
              </Button>
            </div>
          </>
        )}
      </div>
    </Scrim>
  );
}
