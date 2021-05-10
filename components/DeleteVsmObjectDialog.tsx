import { Button, Icon, Scrim, Typography } from "@equinor/eds-core-react";
import styles from "../layouts/default.layout.module.scss";
import React, { useState } from "react";
import { vsmObject } from "../interfaces/VsmObject";
import { useStoreDispatch } from "../hooks/storeHooks";
import { getVsmTypeName } from "./GetVsmTypeName";
import { vsmObjectTypes } from "../types/vsmObjectTypes";

export function DeleteVsmObjectDialog(props: {
  objectToDelete: vsmObject;
  onClose: () => void;
}) {
  const dispatch = useStoreDispatch();

  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null); //Todo: Display error if error

  const handleClose = () => {
    setError(null);
    props.onClose();
  };

  const handleDelete = () => {
    setError(null);
    setIsDeleting(true);
    dispatch
      .deleteVSMObject(props.objectToDelete)
      .then(() => {
        setIsDeleting(false);
        handleClose();
      })
      .catch((error) => setError(error));
  };

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
        {isDeleting ? (
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
              {error && (
                <Typography color={"warning"} variant={"h4"}>
                  {`${error}`}
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
