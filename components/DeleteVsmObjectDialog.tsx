import { Button, Icon, Scrim, Typography } from "@equinor/eds-core-react";
import { close as closeIcon, delete_forever } from "@equinor/eds-icons";
import { useAccount, useMsal } from "@azure/msal-react";
import { useMutation, useQueryClient } from "react-query";

import React from "react";
import { deleteVSMObject } from "../services/vsmObjectApi";
import { getVsmTypeName } from "../utils/GetVsmTypeName";
import { notifyOthers } from "../services/notifyOthers";
import styles from "../layouts/default.layout.module.scss";
import { unknownErrorToString } from "../utils/isError";
import { useRouter } from "next/router";
import { useStoreDispatch } from "hooks/storeHooks";
import { vsmObject } from "../interfaces/VsmObject";
import { vsmObjectTypes } from "../types/vsmObjectTypes";

export function DeleteVsmObjectDialog(props: {
  objectToDelete: vsmObject;
  onClose: () => void;
  visible: boolean;
}): JSX.Element {
  const { accounts } = useMsal();
  const account = useAccount(accounts[0] || {});

  const router = useRouter();
  const { id } = router.query;
  const dispatch = useStoreDispatch();
  const queryClient = useQueryClient();
  const deleteMutation = useMutation((id: string) => deleteVSMObject(id), {
    onSuccess() {
      handleClose();
      notifyOthers("Deleted a card", id, account);
      return queryClient.invalidateQueries();
    },
    onError: (e) => dispatch.setSnackMessage(unknownErrorToString(e)),
  });

  if (!props.visible) return null;

  const handleClose = () => props.onClose();
  const handleDelete = () => deleteMutation.mutate(props.objectToDelete.id);

  const { type } = props.objectToDelete;
  const { choice, mainActivity } = vsmObjectTypes;

  const header = `Delete "${getVsmTypeName(type)}"`;
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
