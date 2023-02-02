import React, { useEffect, useState } from "react";
import { Handle, Position } from "reactflow";
import { formatCanvasText } from "../utils/FormatCanvasText";
import { formatDuration } from "types/timeDefinitions";
import { Checkbox, Icon } from "@equinor/eds-core-react";
import { time as timeIcon } from "@equinor/eds-icons";

import styles from "./Card.module.css";
import { CardButtonsContainer } from "./CardButtonsContainer";
import { SubActivityButton } from "./SubActivityButton";
import { ChoiceButton } from "./ChoiceButton";
import { WaitingButton } from "./WaitingButton";
import { QIPRContainer } from "./QIPRContainer";
import { MergeButtons } from "./MergeButtons";
import { MergeButton } from "./MergeButton";

export const WaitingCard = (props) => {
  const [hovering, setHovering] = useState(false);

  const {
    card: { time, timeDefinition, vsmObjectType, tasks },
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
          className={`${styles.card} ${styles["card--waiting"]} ${
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
          <QIPRContainer onClick={() => handleClickCard()} tasks={tasks} />
        )}
      </div>
      {renderCardButtons()}
    </div>
  );
};
