import React from "react";
import styles from "./CardButtons.module.css";

export const MainActivityButton = (props) => (
  <div className={styles.cardButtonContainer}>
    <div
      className={`${styles.cardButton} ${styles["cardButton--mainactivity"]}`}
      onClick={() => props.onClick()}
      title="Main Activity"
    />
  </div>
);
