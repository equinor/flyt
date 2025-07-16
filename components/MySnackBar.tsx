import { ReactNode, useEffect } from "react";
import { Icon, Scrim } from "@equinor/eds-core-react";
import { download_done } from "@equinor/eds-icons";
import styles from "./MySnackBar.module.scss";

export const MySnackBar = (props: {
  children: ReactNode;
  autoHideDuration: number;
  onClose: () => void;
  downloadSnackbar: boolean;
}): JSX.Element => {
  useEffect(() => {
    setTimeout(() => {
      props.onClose();
    }, props.autoHideDuration);
  }, []);

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
