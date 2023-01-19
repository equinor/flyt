import React, { useState } from "react";
import { Handle, Position } from "reactflow";
import { formatCanvasText } from "../utils/FormatCanvasText";

import styles from "./Card.module.css";
import { CardButtonsContainer } from "./CardButtonsContainer";
import { SubActivityButton } from "./SubActivityButton";
import { ChoiceButton } from "./ChoiceButton";
import { WaitingButton } from "./WaitingButton";

export function ChoiceCard(props) {
  const size = 132;
  const [hovering, setHovering] = useState(false);
  const { name, vsmObjectType } = props.data.card;
  const { isDropTarget, isValidDropTarget } = props.data;

  const handleClick = () => {};

  //<div onClick={onClick} className={`${styles.card} ${styles["card--choice"]}`} title="click to add a child node">
  return (
    <div
      className={styles["card--choice"]}
      onClick={() => props.data.handleClick(props.data.card)}
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
        {name ? (
          <p
            style={{ width: 100, marginLeft: 15, overflowWrap: "break-word" }}
            className={styles.text}
          >
            {formatCanvasText(name, 50)}
          </p>
        ) : (
          <p
            style={{ width: 100, marginLeft: 15 }}
            className={`${styles.text} ${styles["text--placeholder"]}`}
          >
            {formatCanvasText(vsmObjectType.name)}
          </p>
        )}
      </div>
      {hovering && (
        <>
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
