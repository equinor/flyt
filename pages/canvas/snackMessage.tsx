import { useStoreDispatch, useStoreState } from "../../hooks/storeHooks";
import styles from "../../layouts/default.layout.module.scss";
import { Snackbar } from "@equinor/eds-core-react";
import React from "react";

export function SnackMessage(): JSX.Element {
  const snackMessage = useStoreState((state) => state.snackMessage);
  const dispatch = useStoreDispatch();

  return snackMessage ? (
    <div className={styles.snackbar}>
      <Snackbar
        open
        autoHideDuration={3000}
        leftAlignFrom="1200px"
        onClose={() => dispatch.setSnackMessage(null)}
      >
        {`${snackMessage}`}
      </Snackbar>
    </div>
  ) : null;
}
