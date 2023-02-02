import React, { useState } from "react";
import { Handle, Position } from "reactflow";
import { formatCanvasText } from "../utils/FormatCanvasText";

import styles from "./Card.module.css";
import { CardButtonsContainer } from "./CardButtonsContainer";
import { MainActivityButton } from "./MainActivityButton";
import { QIPRContainer } from "./QIPRContainer";

export function GenericCard(props) {
  const [hovering, setHovering] = useState(false);

  const {
    card: { name, vsmObjectType, tasks },
    isValidDropTarget,
    isDropTarget,
    handleClickCard,
  } = props.data;

  const handleClick = () => {
    console.log("Click");
  };

  const renderCardButtons = () => {
    if (hovering) {
      if (vsmObjectType.pkObjectType === 3) {
        return (
          <CardButtonsContainer position={Position.Right}>
            <MainActivityButton onClick={() => handleClick()} />
          </CardButtonsContainer>
        );
      } else if (vsmObjectType.pkObjectType === 8) {
        return (
          <CardButtonsContainer position={Position.Left}>
            <MainActivityButton onClick={() => handleClick()} />
          </CardButtonsContainer>
        );
      }
    }
  };

  return (
    <div
      onMouseEnter={() => !props.dragging && setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      // style={{
      //   display: "flex",
      //   alignItems: "center",
      // }}
    >
      <div
        className={`${styles.container} ${
          hovering ? styles["container--hover"] : ""
        }`}
        style={{ display: "flex" }}
      >
        <div
          onClick={() => handleClickCard()}
          className={`${styles.card} ${styles["card--generic"]} ${
            styles[
              isDropTarget && isValidDropTarget
                ? "card--validDropTarget"
                : isValidDropTarget === false
                ? "card--invalidDropTarget"
                : ""
            ]
          }`}
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
          <Handle
            className={styles.handle}
            type="target"
            position={Position.Top}
            isConnectable={false}
          />
        </div>
        {tasks?.length > 0 && (
          <QIPRContainer onClick={() => handleClickCard()} tasks={tasks} />
        )}
      </div>
      {renderCardButtons()}
    </div>
  );
}
