import React, { useState } from "react";
import MergeIcon from "../../public/Merge/MergeIcon.svg";
import MergeIconOutlined from "../../public/Merge/MergeIconOutlined.svg";
import styles from "./CardButtons.module.scss";
import { CardButton } from "../../interfaces/CardButton";

export const MergeButton = (props: CardButton) => {
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
