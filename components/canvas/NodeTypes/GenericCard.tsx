import React, { useState } from "react";
import { Handle, Position } from "reactflow";
import { formatCanvasText } from "../utils/FormatCanvasText";

import styles from "./Card.module.css";
import { CardButtonsContainer } from "./CardButtonsContainer";
import { MainActivityButton } from "./MainActivityButton";

export function GenericCard(props) {
  const [hovering, setHovering] = useState(false);
  const { name, vsmObjectType } = props.data.card;
  const { isDropTarget, isValidDropTarget } = props.data;

  const getCardButtons = () => {
    if (hovering) {
      if (vsmObjectType.pkObjectType === 3) {
        return (
          <CardButtonsContainer position={Position.Right}>
            <MainActivityButton onClick={handleClick} />
          </CardButtonsContainer>
        );
      } else if (vsmObjectType.pkObjectType === 8) {
        return (
          <CardButtonsContainer position={Position.Left}>
            <MainActivityButton onClick={handleClick} />
          </CardButtonsContainer>
        );
      }
    }
  };

  const handleClick = () => {};

  return (
    <div
      onClick={() => props.data.handleClick(props.data.card)}
      className={`${styles.card} ${styles["card--generic"]}`}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      style={{
        filter:
          isDropTarget && isValidDropTarget
            ? "brightness(1.85)"
            : isValidDropTarget === false
            ? "brightness(0.85)"
            : "",
      }}
    >
      <div className={styles["card__description-container"]}>
        {name ? (
          <p className={styles.text}>{formatCanvasText(name, 70)}</p>
        ) : (
          <p className={`${styles.text} ${styles["text--placeholder"]}`}>
            {formatCanvasText(vsmObjectType.name, 70)}
          </p>
        )}
      </div>
      {getCardButtons()}
      <Handle
        className={styles.handle}
        type="target"
        position={Position.Top}
        isConnectable={false}
      />
    </div>
  );
}
