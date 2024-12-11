import { unknownErrorToString } from "@/utils/isError";
import {
  Button,
  Checkbox,
  CircularProgress,
  Icon,
  Scrim,
  Typography,
} from "@equinor/eds-core-react";
import { close as closeIcon, delete_forever } from "@equinor/eds-icons";
import { ChangeEvent, useState } from "react";
import styles from "./ScrimDelete.module.scss";
import { TypographyMarkdown } from "./TypographyMarkdown";

type ScrimDelete = {
  id?: string;
  open: boolean;
  onConfirm: (id: string, checked: boolean) => void;
  onClose: () => void;
  header?: string;
  warningMessage?: string;
  confirmMessage?: string;
  checkboxMessage?: string;
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
  checkboxMessage,
  error,
  isLoading,
}: ScrimDelete) => {
  const [checked, setChecked] = useState(false);

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
              <TypographyMarkdown variant={"h4"}>
                {warningMessage}
              </TypographyMarkdown>
              {checkboxMessage && (
                <Checkbox
                  label={checkboxMessage}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setChecked(e.target.checked)
                  }
                />
              )}
            </div>
            <div className={styles.buttonsGroup}>
              <Button variant={"outlined"} onClick={() => onClose()}>
                {"Cancel"}
              </Button>
              <Button
                variant={"contained"}
                color={"danger"}
                onClick={() => id && onConfirm(id, checked)}
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
