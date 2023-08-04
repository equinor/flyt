import { NodeData } from "interfaces/NodeData";
import React, { useState } from "react";
import { Handle, Position } from "reactflow";
import { formatCanvasText } from "./utils/FormatCanvasText";

import styles from "./Card.module.scss";
import { CardButtonsContainer } from "./CardButtonsContainer";
import { MainActivityButton } from "./MainActivityButton";
import { QIPRContainer } from "./QIPRContainer";
import { Node } from "reactflow";
import { vsmObjectTypes } from "types/vsmObjectTypes";

export function GenericCard(props: Node<NodeData>) {
  const [hovering, setHovering] = useState(false);

  const {
    id,
    description,
    type,
    tasks,
    isValidDropTarget,
    isDropTarget,
    handleClickCard,
    handleClickAddCard,
    userCanEdit,
  } = props.data;

  const renderCardButtons = () => {
    if (hovering) {
      if (type === "Input") {
        return (
          <CardButtonsContainer position={Position.Right}>
            <MainActivityButton
              onClick={() =>
                handleClickAddCard(
                  id,
                  vsmObjectTypes.mainActivity,
                  Position.Right
                )
              }
            />
          </CardButtonsContainer>
        );
      } else if (type === "Output") {
        return (
          <CardButtonsContainer position={Position.Left}>
            <MainActivityButton
              onClick={() =>
                handleClickAddCard(
                  id,
                  vsmObjectTypes.mainActivity,
                  Position.Left
                )
              }
            />
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
            {description ? (
              <p className={styles.text}>{formatCanvasText(description, 70)}</p>
            ) : (
              <p className={`${styles.text} ${styles["text--placeholder"]}`}>
                {formatCanvasText(type, 70)}
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
      {userCanEdit && renderCardButtons()}
    </div>
  );
}
