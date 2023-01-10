import React, { useEffect, useState } from "react";
import { Handle, Position } from "reactflow";
import { formatCanvasText } from "../utils/FormatCanvasText";
import { formatDuration } from "types/timeDefinitions";
import { Icon } from "@equinor/eds-core-react";
import { time as timeIcon } from "@equinor/eds-icons";

import styles from "./Card.module.css";
import { CardButtonsContainer } from "./CardButtonsContainer";
import { SubActivityButton } from "./SubActivityButton";
import { ChoiceButton } from "./ChoiceButton";
import { WaitingButton } from "./WaitingButton";
import { QIPRContainer } from "./QIPRContainer";

export const WaitingCard = (props) => {
  const [hovering, setHovering] = useState(false);
  const { time, timeDefinition, vsmObjectType, tasks } = props.data.card;
  const { isDropTarget, isValidDropTarget, isDragging } = props.data;

  const handleClick = () => {};

  useEffect(() => {
    setHovering(false);
  }, [isDragging]);

  return (
    <div
      onMouseEnter={() => !isDragging && setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      style={{
        display: "flex",
        justifyContent: "row",
      }}
    >
      <div
        className={`${styles.container} ${
          hovering && styles["container--hover"]
        }`}
        style={{ display: "flex" }}
      >
        <div
          onClick={() => props.data.handleClick(props.data.card)}
          className={`${styles.card} ${styles["card--waiting"]}`}
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
            <p className={`${styles.text} ${styles["text--placeholder"]}`}>
              {formatCanvasText(vsmObjectType.name, 70)}
            </p>
          </div>
          <div>
            <p
              className={`${styles.text} ${styles["card__waitingtime-container"]}`}
            >
              <Icon data={timeIcon} size={24} style={{ marginRight: 5 }} />
              {formatDuration(time, timeDefinition)}
            </p>
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
          <QIPRContainer
            onClick={() => props.data.handleClick(props.data.card)}
            tasks={tasks}
          />
        )}
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
    </div>
  );
};
