import { ReactNode, useEffect } from "react";
import { Button, Icon, Scrim } from "@equinor/eds-core-react";
import {
  check_circle_outlined,
  close,
  download_done,
  error_outlined,
  warning_outlined,
  refresh,
} from "@equinor/eds-icons";
import styles from "./MySnackBar.module.scss";

export const MySnackBar = (props: {
  children: ReactNode;
  autoHideDuration: number;
  onClose: () => void;
  downloadSnackbar: boolean;
  variant?: "success" | "error";
  onRetry?: () => void;
}): JSX.Element => {
  useEffect(() => {
    setTimeout(() => {
      props.onClose();
    }, props.autoHideDuration);
  }, []);

  if (props.variant === "success") {
    return (
      <div className={styles.successStyle}>
        <Icon data={download_done} color={"#007079"} size={24} />
        <span className={styles.message} style={{ fontSize: "16px" }}>
          {props.children}{" "}
        </span>
        <Icon
          data={close}
          onClick={props.onClose}
          className={styles.closeIcon}
          size={16}
        />
      </div>
    );
  }

  if (props.variant === "error") {
    return (
      <div className={styles.errorStyle}>
        <Icon data={warning_outlined} color={"#FF9200"} size={24} />
        <span className={styles.message} style={{ fontSize: "16px" }}>
          {props.children}{" "}
        </span>
        {props.onRetry && (
          <Button
            variant="outlined"
            className={styles.retryButton}
            onClick={props.onRetry}
            style={{ fontSize: "14px" }}
          >
            <Icon data={refresh} />
            Retry
          </Button>
        )}
      </div>
    );
  }

  const renderSnackbar = () => {
    return (
      <div
        onClick={() => {
          props.onClose();
        }}
        className={
          props.downloadSnackbar
            ? styles.downloadSnackMessageStyle
            : styles.defaultStyle
        }
      >
        {props.downloadSnackbar ? (
          <Icon data={download_done} color={"#007079"} />
        ) : null}
        {props.children}
      </div>
    );
  };

  return props.downloadSnackbar ? (
    <Scrim open isDismissable onClose={props.onClose}>
      {renderSnackbar()}
    </Scrim>
  ) : (
    <>{renderSnackbar()}</>
  );
};
