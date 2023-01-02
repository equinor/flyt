import React, { useEffect, useState } from "react";
import { Handle, Position } from "reactflow";
import { formatCanvasText } from "../utils/FormatCanvasText";
import { formatDuration } from "types/timeDefinitions";

import styles from "./Card.module.css";
import { SubActivityButton } from "./SubActivityButton";
import { CardButtonsContainer } from "./CardButtonsContainer";
import { ChoiceButton } from "./ChoiceButton";
import { WaitingButton } from "./WaitingButton";

export function SubActivityCard(props) {
  const [hovering, setHovering] = useState(false);
  const { name, role, time, timeDefinition, vsmObjectType } = props.data.card;
  const { isDropTarget, isValidDropTarget, isDragging } = props.data;

  const handleClick = () => {};

  useEffect(() => {
    setHovering(false);
  }, [isDragging]);

  return (
    <div
      onMouseEnter={() => !isDragging && setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <div
        onClick={() => props.data.handleClick(props.data.card)}
        className={`${styles.card} ${styles["card--subactivity"]}`}
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
        <div className={styles["card__role-container"]}>
          <p className={styles.text}>
            {formatCanvasText(role ?? "", 16, true)}
          </p>
        </div>
        <div className={styles["card__time-container"]}>
          <p className={styles.text}>
            {formatCanvasText(formatDuration(time, timeDefinition), 12, true)}
          </p>
        </div>
      </div>
      {hovering && (
        <>
          <CardButtonsContainer position={Position.Bottom}>
            <SubActivityButton onClick={handleClick} />
            <ChoiceButton onClick={handleClick} />
            <WaitingButton onClick={handleClick} />
          </CardButtonsContainer>
          <CardButtonsContainer position={Position.Top}>
            <SubActivityButton onClick={handleClick} />
            <ChoiceButton onClick={handleClick} />
            <WaitingButton onClick={handleClick} />
          </CardButtonsContainer>
        </>
      )}
      <Handle
        className={styles.handle}
        type="target"
        position={Position.Top}
        isConnectable={false}
      />
      <Handle
        className={styles.handle}
        type="source"
        position={Position.Bottom}
        isConnectable={false}
      />
    </div>
  );
}
