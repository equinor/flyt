import React, { useEffect, useState } from "react";
import { Handle, Position } from "reactflow";
import { formatCanvasText } from "./utils/FormatCanvasText";

import styles from "./Card.module.scss";
import { CardButtonsContainer } from "./CardButtonsContainer";
import { SubActivityButton } from "./SubActivityButton";
import { ChoiceButton } from "./ChoiceButton";
import { WaitingButton } from "./WaitingButton";

export function ChoiceCard(props) {
  const [hovering, setHovering] = useState(false);

  const {
    card: { id, description, type },
    isDropTarget,
    isValidDropTarget,
    handleClickCard,
    parentCard,
    handleClickAddCard,
  } = props.data;

  const size = 132;

  useEffect(() => {
    setHovering(false);
  }, [props.dragging]);

  return (
    <div
      onMouseEnter={() => {
        !props.dragging && setHovering(true);
      }}
      onMouseLeave={() => setHovering(false)}
    >
      <div
        onClick={() => handleClickCard()}
        className={`${hovering ? styles["container--hover"] : ""} ${
          styles[
            isDropTarget && isValidDropTarget
              ? "card--validDropTarget"
              : isValidDropTarget === false
              ? "card--invalidDropTarget"
              : ""
          ]
        }`}
      >
        <svg
          style={{ display: "block", overflow: "visible" }}
          width={size}
          height={size}
        >
          <path
            d={`M0,${size / 2} L${size / 2},0 L${size},${size / 2} L${
              size / 2
            },${size} z`}
            {...{ fill: "#FDD835" }}
          />
        </svg>
        <div
          style={{
            display: "flex",
            textAlign: "center",
            alignItems: "center",
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
        >
          {description ? (
            <p
              style={{ width: 100, marginLeft: 15, overflowWrap: "break-word" }}
              className={styles.text}
            >
              {formatCanvasText(description, 50)}
            </p>
          ) : (
            <p
              style={{ width: 100, marginLeft: 15 }}
              className={`${styles.text} ${styles["text--placeholder"]}`}
            >
              {formatCanvasText(type)}
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
      {hovering && (
        <>
          {/* <CardButtonsContainer position={Position.Top}>
            <SubActivityButton
              onClick={() => handleClickAddCard(parentCard.id, "SubActivity")}
            />
            <ChoiceButton
              onClick={() => handleClickAddCard(parentCard.id, "Choice")}
            />
            <WaitingButton
              onClick={() => handleClickAddCard(parentCard.id, "Waiting")}
            />
          </CardButtonsContainer> */}
          {parentCard.type === "Choice" && (
            <>
              <CardButtonsContainer position={Position.Right}>
                <SubActivityButton
                  onClick={() =>
                    handleClickAddCard(id, "SubActivity", Position.Right)
                  }
                />
                <ChoiceButton
                  onClick={() =>
                    handleClickAddCard(id, "Choice", Position.Right)
                  }
                />
                <WaitingButton
                  onClick={() =>
                    handleClickAddCard(id, "Waiting", Position.Right)
                  }
                />
              </CardButtonsContainer>
              <CardButtonsContainer position={Position.Left}>
                <SubActivityButton
                  onClick={() =>
                    handleClickAddCard(id, "SubActivity", Position.Left)
                  }
                />
                <ChoiceButton
                  onClick={() =>
                    handleClickAddCard(id, "Choice", Position.Left)
                  }
                />
                <WaitingButton
                  onClick={() =>
                    handleClickAddCard(id, "Waiting", Position.Left)
                  }
                />
              </CardButtonsContainer>
            </>
          )}
        </>
      )}
    </div>
  );
}
