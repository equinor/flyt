import React, { useState } from "react";
import MergeIcon from "./MergeIcon.svg";
import MergeIconOutlined from "./MergeIconOutlined.svg";
import styles from "./CardButtons.module.css";

export const MergeButton = (props) => {
  const [hovering, setHovering] = useState(false);

  return (
    <div
      className={styles.cardButtonContainer}
      style={{ cursor: "pointer" }}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onClick={() => props.onClick()}
    >
      <img
        src={props.active || hovering ? MergeIcon.src : MergeIconOutlined.src}
        title="Merge"
      />
    </div>
  );
};
