import React, { useEffect, useState } from "react";
import { Handle, Position, NodeToolbar } from "reactflow";
import { formatCanvasText } from "../utils/FormatCanvasText";
import { MainActivityButton } from "./MainActivityButton";
import { SubActivityButton } from "./SubActivityButton";
import { ChoiceButton } from "./ChoiceButton";
import { WaitingButton } from "./WaitingButton";
import { CardButtonsContainer } from "./CardButtonsContainer";

import styles from "./Card.module.css";
import { QIPRContainer } from "./QIPRContainer";

export function MainActivityCard(props) {
  const [hovering, setHovering] = useState(false);

  const {
    card: { name, vsmObjectType, tasks },
    isValidDropTarget,
    isDropTarget,
    handleClickCard,
  } = props.data;

  useEffect(() => {
    setHovering(false);
  }, [props.dragging]);

  const handleClick = () => {
    console.log("Click");
  };

  return (
    <div
      onMouseEnter={() => !props.dragging && setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      style={{
        display: "flex",
        justifyContent: "row",
      }}
    >
      <div
        className={`${styles.container} ${
          hovering ? styles["container--hover"] : ""
        }`}
        style={{ display: "flex" }}
      >
        <div
          onClick={() => handleClickCard()}
          className={`${styles.card} ${styles["card--mainactivity"]} ${
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
          <Handle
            className={styles.handle}
            type="source"
            position={Position.Bottom}
            isConnectable={false}
          />
        </div>
        {tasks?.length > 0 && (
          <QIPRContainer onClick={() => handleClickCard()} tasks={tasks} />
        )}
      </div>
      {hovering && (
        <>
          <CardButtonsContainer position={Position.Left}>
            <MainActivityButton onClick={() => handleClick()} />
          </CardButtonsContainer>
          <CardButtonsContainer position={Position.Right}>
            <MainActivityButton onClick={() => handleClick()} />
          </CardButtonsContainer>
          <CardButtonsContainer position={Position.Bottom}>
            <SubActivityButton onClick={() => handleClick()} />
            <ChoiceButton onClick={() => handleClick()} />
            <WaitingButton onClick={() => handleClick()} />
          </CardButtonsContainer>
        </>
      )}
    </div>
  );
}
