import React from "react";
import styles from "./CardButtons.module.css";

export const SubActivityButton = (props) => (
  <div className={styles.cardButtonContainer}>
    <div
      className={`${styles.cardButton} ${styles["cardButton--subactivity"]}`}
      onClick={() => props.onClick()}
      title="Sub Activity"
    />
  </div>
);
