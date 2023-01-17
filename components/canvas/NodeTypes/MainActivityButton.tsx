import React, { useState } from "react";
import styles from "./CardButtons.module.css";

export const MainActivityButton = (props) => {
  const [hovering, setHovering] = useState(false);

  return (
    <div className={styles.cardButtonContainer}>
      <div
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        className={`${styles.cardButton} ${
          styles["cardButton--mainactivity"]
        }  ${
          (hovering || props.active) &&
          styles["cardButton--mainactivity--hover"]
        }`}
        onClick={() => props.onClick()}
        title="Main Activity"
      />
    </div>
  );
};
