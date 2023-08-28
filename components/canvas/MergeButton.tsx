import React, { useState } from "react";
import MergeButtonIcon from "../../public/CardButtons/MergeButtonIcon.svg";
import MergeButtonIconOutlined from "../../public/CardButtons/MergeButtonIconOutlined.svg";
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
        src={hovering ? MergeButtonIcon.src : MergeButtonIconOutlined.src}
        title="Merge"
      />
    </div>
  );
};
