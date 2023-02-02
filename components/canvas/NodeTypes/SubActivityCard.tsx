import React, { useEffect, useState } from "react";
import { Handle, Position } from "reactflow";
import { formatCanvasText } from "../utils/FormatCanvasText";
import { formatDuration } from "types/timeDefinitions";

import styles from "./Card.module.css";
import { SubActivityButton } from "./SubActivityButton";
import { CardButtonsContainer } from "./CardButtonsContainer";
import { ChoiceButton } from "./ChoiceButton";
import { WaitingButton } from "./WaitingButton";
import { QIPRContainer } from "./QIPRContainer";
import { MergeButton } from "./MergeButton";
import { Checkbox } from "@equinor/eds-core-react";
import { NodeData } from "interfaces/NodeData";
import { Node } from "reactflow";
import { MergeButtons } from "./MergeButtons";

export const SubActivityCard = (props: Node<NodeData>) => {
  const [hovering, setHovering] = useState(false);

  const {
    card: { name, role, time, timeDefinition, vsmObjectType, tasks },
    isValidDropTarget,
    isDropTarget,
    columnId,
    mergeable,
    mergeInitiator,
    mergeOption,
    handleClickCard,
    handleClickMergeInit,
    handleClickMergeOptionCheckbox,
    handleClickConfirmMerge,
    handleClickCancelMerge,
    isChoiceChild,
  } = props.data;

  useEffect(() => {
    setHovering(false);
  }, [props.dragging]);

  const handleClick = () => {
    console.log("Click");
  };

  const renderCardButtons = () => {
    if (mergeInitiator) {
      return (
        <CardButtonsContainer position={Position.Bottom}>
          <MergeButtons
            handleClickConfirmMerge={(selectedType) =>
              handleClickConfirmMerge(selectedType)
            }
            handleClickCancelMerge={() => handleClickCancelMerge(columnId)}
            mergeInitiator={mergeInitiator}
          />
        </CardButtonsContainer>
      );
    } else if (mergeOption) {
      return (
        <CardButtonsContainer position={Position.Bottom}>
          <Checkbox onClick={() => handleClickMergeOptionCheckbox()} />
        </CardButtonsContainer>
      );
    } else if (hovering) {
      return (
        <>
          <CardButtonsContainer position={Position.Bottom}>
            <SubActivityButton onClick={() => handleClick()} />
            <ChoiceButton onClick={() => handleClick()} />
            <WaitingButton onClick={() => handleClick()} />
            {mergeable && (
              <MergeButton onClick={() => handleClickMergeInit(columnId)} />
            )}
          </CardButtonsContainer>
          <CardButtonsContainer position={Position.Top}>
            <SubActivityButton onClick={() => handleClick()} />
            <ChoiceButton onClick={() => handleClick()} />
            <WaitingButton onClick={() => handleClick()} />
          </CardButtonsContainer>
          {isChoiceChild && (
            <>
              <CardButtonsContainer position={Position.Right}>
                <SubActivityButton onClick={() => handleClick()} />
                <ChoiceButton onClick={() => handleClick()} />
                <WaitingButton onClick={() => handleClick()} />
              </CardButtonsContainer>
              <CardButtonsContainer position={Position.Left}>
                <SubActivityButton onClick={() => handleClick()} />
                <ChoiceButton onClick={() => handleClick()} />
                <WaitingButton onClick={() => handleClick()} />
              </CardButtonsContainer>
            </>
          )}
        </>
      );
    }
  };

  return (
    <div
      onMouseEnter={() => !props.dragging && setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <div
        className={`${styles.container} ${
          hovering ? styles["container--hover"] : ""
        }`}
        style={{ display: "flex" }}
      >
        <div
          onClick={() => handleClickCard()}
          className={`${styles.card} ${styles["card--subactivity"]} ${
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
      {renderCardButtons()}
    </div>
  );
};
