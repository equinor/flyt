import React, { useState } from "react";
import styles from "./CardButtons.module.scss";
import { CardButton } from "./../../interfaces/CardButton";

export const WaitingButton = (props: CardButton) => {
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
