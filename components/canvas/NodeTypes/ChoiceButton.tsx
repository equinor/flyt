import React from "react";
import styles from "./CardButtons.module.css";

export const ChoiceButton = (props) => (
  <div className={styles.cardButtonContainer}>
    <div
      className={`${styles.cardButton} ${styles["cardButton--choice"]}`}
      onClick={() => props.onClick()}
      title="Choice"
    />
  </div>
);
