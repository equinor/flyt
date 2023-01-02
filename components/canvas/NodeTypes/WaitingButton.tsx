import React from "react";
import styles from "./CardButtons.module.css";

export const WaitingButton = (props) => (
  <div className={styles.cardButtonContainer}>
    <div
      className={`${styles.cardButton} ${styles["cardButton--waiting"]}`}
      onClick={() => props.onClick()}
      title="Waiting"
    />
  </div>
);
