import React, { useState } from "react";
import styles from "./CardButtons.module.css";

export const WaitingButton = (props) => {
  const [hovering, setHovering] = useState(false);

  return (
    <div className={styles.cardButtonContainer}>
      <div
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        className={`${styles.cardButton} ${styles["cardButton--waiting"]}  ${
          (hovering || props.active) && styles["cardButton--waiting--hover"]
        }`}
        onClick={() => props.onClick()}
        title="Waiting"
      />
    </div>
  );
};
