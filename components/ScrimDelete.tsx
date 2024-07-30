import { Button, Icon, Scrim, Typography } from "@equinor/eds-core-react";
import styles from "./ScrimDelete.module.scss";
import { close as closeIcon, delete_forever } from "@equinor/eds-icons";
import { unknownErrorToString } from "@/utils/isError";
import { CircularProgress } from "@equinor/eds-core-react";

type ScrimDelete = {
  id: string;
  open: boolean;
  onConfirm: (id: string) => void;
  onClose: () => void;
  header?: string;
  warningMessage?: string;
  confirmMessage?: string;
  error?: unknown;
  isLoading?: boolean;
};

export const ScrimDelete = ({
  id,
  open,
  onConfirm,
  onClose,
  header,
  warningMessage,
  confirmMessage,
  error,
  isLoading,
}: ScrimDelete) => {
  return (
    <Scrim isDismissable open={open} onClose={onClose}>
      <div className={styles.scrimWrapper}>
        {isLoading ? (
          <div className={styles.loaderContainer}>
            <CircularProgress />
            <Typography>Deleting...</Typography>
          </div>
        ) : (
          <>
            <div className={styles.scrimHeaderWrapper}>
              <div className={styles.scrimTitle}>
                <Typography variant={"h6"}>{header}</Typography>
              </div>
              <Button autoFocus variant={"ghost_icon"} onClick={onClose}>
                <Icon data={closeIcon} title="Close" />
              </Button>
            </div>
            <div className={styles.scrimContent}>
              {!!error && (
                <Typography color={"warning"} variant={"h4"}>
                  {unknownErrorToString(error)}
                </Typography>
              )}
              <Typography variant={"h4"}>{warningMessage}</Typography>
            </div>
            <div className={styles.buttonsGroup}>
              <Button variant={"outlined"} onClick={() => onClose()}>
                {"Cancel"}
              </Button>
              <Button
                variant={"contained"}
                color={"danger"}
                onClick={() => onConfirm(id)}
              >
                <Icon data={delete_forever} title="Delete" size={16} />
                {confirmMessage}
              </Button>
            </div>
          </>
        )}
      </div>
    </Scrim>
  );
};
