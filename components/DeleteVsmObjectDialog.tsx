import { Button, Icon, Scrim, Typography } from "@equinor/eds-core-react";
import styles from "../layouts/default.layout.module.scss";
import React from "react";
import { vsmObject } from "../interfaces/VsmObject";
import { getVsmTypeName } from "./GetVsmTypeName";
import { vsmObjectTypes } from "../types/vsmObjectTypes";
import { useMutation, useQueryClient } from "react-query";
import { unknownErrorToString } from "../utils/isError";
import { deleteVSMObject } from "../services/vsmObjectApi";
import { useStoreDispatch } from "hooks/storeHooks";

export function DeleteVsmObjectDialog(props: {
  objectToDelete: vsmObject;
  onClose: () => void;
  visible: boolean;
}): JSX.Element {
  const dispatch = useStoreDispatch();
  const queryClient = useQueryClient();
  const deleteMutation = useMutation(
    (vsmObjectID: number) => deleteVSMObject(vsmObjectID),
    {
      onSuccess() {
        props.onClose();
        return queryClient.invalidateQueries();
      },
      onError: (e) => dispatch.setSnackMessage(unknownErrorToString(e)),
    }
  );

  if (!props.visible) return null;

  const handleClose = () => props.onClose();
  const handleDelete = () =>
    deleteMutation.mutate(props.objectToDelete.vsmObjectID);

  const { pkObjectType: type } = props.objectToDelete.vsmObjectType;
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
    <Scrim onClose={handleClose} isDismissable>
      <div className={styles.scrimWrapper}>
        {deleteMutation.isLoading ? (
          <Typography>Deleting...</Typography>
        ) : (
          <>
            <div className={styles.scrimHeaderWrapper}>
              <div className={styles.scrimTitle}>{header}</div>
              <Button autoFocus variant={"ghost_icon"} onClick={handleClose}>
                <Icon name="close" title="Close" />
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
                <Icon name="delete_forever" title="Delete VSM" size={16} />
                {confirmMessage}
              </Button>
            </div>
          </>
        )}
      </div>
    </Scrim>
  );
}
