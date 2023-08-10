import React, { useEffect, useState } from "react";
import { Handle, Position } from "reactflow";
import { formatCanvasText } from "./utils/FormatCanvasText";

import styles from "./Card.module.scss";
import { CardButtonsContainer } from "./CardButtonsContainer";
import { SubActivityButton } from "./SubActivityButton";
import { ChoiceButton } from "./ChoiceButton";
import { WaitingButton } from "./WaitingButton";
import { vsmObjectTypes } from "types/vsmObjectTypes";

export function ChoiceCard(props) {
  const [hovering, setHovering] = useState(false);

  const {
    id,
    description,
    type,
    isDropTarget,
    isValidDropTarget,
    handleClickCard,
    isChoiceChild,
    handleClickAddCard,
    userCanEdit,
    children,
  } = props.data;

  const size = 132;
  const lastChild = children[children?.length - 1];

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
              style={{
                width: 90,
                marginLeft: 20,
                overflowWrap: "break-word",
              }}
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
      {hovering && userCanEdit && (
        <>
          <CardButtonsContainer position={Position.Bottom}>
            <SubActivityButton
              onClick={() =>
                handleClickAddCard(
                  lastChild || id,
                  vsmObjectTypes.subActivity,
                  lastChild ? Position.Right : Position.Bottom
                )
              }
            />
            <ChoiceButton
              onClick={() =>
                handleClickAddCard(
                  lastChild || id,
                  vsmObjectTypes.choice,
                  lastChild ? Position.Right : Position.Bottom
                )
              }
            />
            <WaitingButton
              onClick={() =>
                handleClickAddCard(
                  lastChild || id,
                  vsmObjectTypes.waiting,
                  lastChild ? Position.Right : Position.Bottom
                )
              }
            />
          </CardButtonsContainer>
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
          {isChoiceChild && (
            <>
              <CardButtonsContainer position={Position.Right}>
                <SubActivityButton
                  onClick={() =>
                    handleClickAddCard(
                      id,
                      vsmObjectTypes.subActivity,
                      Position.Right
                    )
                  }
                />
                <ChoiceButton
                  onClick={() =>
                    handleClickAddCard(
                      id,
                      vsmObjectTypes.choice,
                      Position.Right
                    )
                  }
                />
                <WaitingButton
                  onClick={() =>
                    handleClickAddCard(
                      id,
                      vsmObjectTypes.waiting,
                      Position.Right
                    )
                  }
                />
              </CardButtonsContainer>
              <CardButtonsContainer position={Position.Left}>
                <SubActivityButton
                  onClick={() =>
                    handleClickAddCard(
                      id,
                      vsmObjectTypes.subActivity,
                      Position.Left
                    )
                  }
                />
                <ChoiceButton
                  onClick={() =>
                    handleClickAddCard(id, vsmObjectTypes.choice, Position.Left)
                  }
                />
                <WaitingButton
                  onClick={() =>
                    handleClickAddCard(
                      id,
                      vsmObjectTypes.waiting,
                      Position.Left
                    )
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
