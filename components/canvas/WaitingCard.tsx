import React, { useEffect, useState } from "react";
import { Handle, Position } from "reactflow";
import { formatCanvasText } from "./utils/FormatCanvasText";
import { formatDuration } from "types/unitDefinitions";
import { Checkbox, Icon } from "@equinor/eds-core-react";
import { time as timeIcon } from "@equinor/eds-icons";

import styles from "./Card.module.scss";
import { CardButtonsContainer } from "./CardButtonsContainer";
import { SubActivityButton } from "./SubActivityButton";
import { ChoiceButton } from "./ChoiceButton";
import { WaitingButton } from "./WaitingButton";
import { QIPRContainer } from "./QIPRContainer";
import { MergeButtons } from "./MergeButtons";
import { MergeButton } from "./MergeButton";
import { NodeData } from "interfaces/NodeData";
import { Node } from "reactflow";

export const WaitingCard = (props: Node<NodeData>) => {
  const [hovering, setHovering] = useState(false);

  const {
    card: { id, duration, unit, type, tasks },
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
    parentCard,
    handleClickAddCard,
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
            <SubActivityButton
              onClick={() =>
                handleClickAddCard(id, "SubActivity", Position.Bottom)
              }
            />
            <ChoiceButton
              onClick={() => handleClickAddCard(id, "Choice", Position.Bottom)}
            />
            <WaitingButton
              onClick={() => handleClickAddCard(id, "Waiting", Position.Bottom)}
            />
            {mergeable && (
              <MergeButton onClick={() => handleClickMergeInit(columnId)} />
            )}
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
              {formatCanvasText(type, 70)}
            </p>
          </div>
          <div>
            <p
              className={`${styles.text} ${styles["card__waitingtime-container"]}`}
            >
              <Icon data={timeIcon} size={24} style={{ marginRight: 5 }} />
              {formatDuration(duration, unit)}
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
