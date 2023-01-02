import React, { useState } from "react";
import { Handle, Position, NodeToolbar } from "reactflow";
import { formatCanvasText } from "../utils/FormatCanvasText";
import { MainActivityButton } from "./MainActivityButton";
import { SubActivityButton } from "./SubActivityButton";
import { ChoiceButton } from "./ChoiceButton";
import { WaitingButton } from "./WaitingButton";
import { CardButtonsContainer } from "./CardButtonsContainer";

import styles from "./Card.module.css";

export function MainActivityCard(props) {
  const [hovering, setHovering] = useState(false);
  const { name, vsmObjectType } = props.data.card;
  const { isDropTarget, isValidDropTarget } = props.data;

  const handleClick = () => {};

  return (
    <>
      <div
        onClick={() => props.data.handleClick(props.data.card)}
        className={`${styles.card} ${styles["card--mainactivity"]}`}
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
        {hovering && (
          <>
            <CardButtonsContainer position={Position.Left}>
              <MainActivityButton onClick={handleClick} />
            </CardButtonsContainer>
            <CardButtonsContainer position={Position.Right}>
              <MainActivityButton onClick={handleClick} />
            </CardButtonsContainer>
            <CardButtonsContainer position={Position.Bottom}>
              <SubActivityButton onClick={handleClick} />
              <ChoiceButton onClick={handleClick} />
              <WaitingButton onClick={handleClick} />
            </CardButtonsContainer>
          </>
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
      {/* <CardButtonsContainer position={Position.Bottom}>
        <SubActivityButton onClick={handleClick} />
        <ChoiceButton onClick={handleClick} />
        <WaitingButton onClick={handleClick} />
      </CardButtonsContainer> */}

      {/* <CardButtonsContainer position={Position.Right}>
        <SubActivityButton onClick={handleClick} />
        <ChoiceButton onClick={handleClick} />
        <WaitingButton onClick={handleClick} />
      </CardButtonsContainer>
      <CardButtonsContainer position={Position.Top}>
        <SubActivityButton onClick={handleClick} />
        <ChoiceButton onClick={handleClick} />
        <WaitingButton onClick={handleClick} />
      </CardButtonsContainer> */}
      {/* <NodeToolbar isVisible={true} position={Position.Right}>
        <MainActivityButton onClick={handleClick} />
      </NodeToolbar>
      <NodeToolbar isVisible={true} position={Position.Left}>
        <MainActivityButton onClick={handleClick} />
      </NodeToolbar>
      <NodeToolbar
        isVisible={true}
        position={Position.Bottom}
        style={{ display: "flex", width: 100, justifyContent: "space-between" }}
      >
        <SubActivityButton onClick={handleClick} />
        <ChoiceButton onClick={handleClick} />
        <WaitingButton onClick={handleClick} />
      </NodeToolbar> */}
    </>
  );
}
