import { Button, Scrim } from "@equinor/eds-core-react";

import React from "react";
import style from "./ResetProcessDialog.module.scss";

export const ResetProcessDialog = ({
  onClose,
  onReset,
  visible,
}: {
  onClose: () => void;
  onReset: () => void;
  visible: boolean;
}): JSX.Element => {
  if (!visible) return null;
  return (
    <Scrim open isDismissable onClose={onClose}>
      <div className={style.resetDialog}>
        <h1 className={style.resetDialogTitle}>Reset To be version</h1>
        <div className={style.resetDialogContent}>
          <p>
            Are you sure you want to reset the To-Be process? By doing so you
            will reset to a blank To-Be process and previous version of the
            To-be process will not be recoverable
          </p>
          <div className={style.resetDialogButtons}>
            <Button autoFocus variant="outlined" onClick={() => onClose()}>
              Cancel
            </Button>
            <Button color="danger" onClick={() => onReset()}>
              Reset
            </Button>
          </div>
        </div>
      </div>
    </Scrim>
  );
};
