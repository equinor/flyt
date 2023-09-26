import React, { useEffect, useState } from "react";
import { Connection, Handle, Position, useStore } from "reactflow";
import { formatCardText } from "./utils/FormatCardText";
import { formatDuration } from "types/unitDefinitions";

import styles from "./Card.module.scss";
import stylesCardButtons from "./CardButtons.module.scss";
import { SubActivityButton } from "./SubActivityButton";
import { CardButtonsContainer } from "./CardButtonsContainer";
import { ChoiceButton } from "./ChoiceButton";
import { WaitingButton } from "./WaitingButton";
import { QIPRContainer } from "./QIPRContainer";
import { NodeData } from "interfaces/NodeData";
import { Node } from "reactflow";
import { vsmObjectTypes } from "types/vsmObjectTypes";
import { MergeStartButton } from "./MergeStartButton";
import { MergeEndButton } from "./MergeEndButton";

export const SubActivityCard = (props: Node<NodeData>) => {
  const [hovering, setHovering] = useState(false);
  const connectionNodeId = useStore((state) => state.connectionNodeId);

  const {
    description,
    role,
    duration,
    unit,
    type,
    tasks,
    id,
    isValidDropTarget,
    isDropTarget,
    mergeable,
    merging,
    mergeOption,
    handleClickCard,
    handleMerge,
    isChoiceChild,
    handleClickAddCard,
    userCanEdit,
  } = props.data;

  useEffect(() => {
    setHovering(false);
  }, [props.dragging, connectionNodeId]);

  const renderCardButtons = () => {
    if (hovering && !merging) {
      return (
        <>
          <CardButtonsContainer position={Position.Bottom}>
            <SubActivityButton
              onClick={() =>
                handleClickAddCard(
                  id,
                  vsmObjectTypes.subActivity,
                  Position.Bottom
                )
              }
            />
            <ChoiceButton
              onClick={() =>
                handleClickAddCard(id, vsmObjectTypes.choice, Position.Bottom)
              }
            />
            <WaitingButton
              onClick={() =>
                handleClickAddCard(id, vsmObjectTypes.waiting, Position.Bottom)
              }
            />
            {mergeable && (
              <MergeStartButton
                onConnect={(e: Connection) => handleMerge(e.source, e.target)}
              />
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
          hovering && !merging ? styles["container--hover"] : ""
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
            {description ? (
              <p className={styles.text}>{formatCardText(description, 70)}</p>
            ) : (
              <p className={`${styles.text} ${styles["text--placeholder"]}`}>
                {formatCardText(type, 70)}
              </p>
            )}
          </div>
          <div className={styles["card__role-container"]}>
            <p className={styles.text}>
              {formatCardText(role ?? "", 16, true)}
            </p>
          </div>
          <div className={styles["card__time-container"]}>
            <p className={styles.text}>
              {formatCardText(formatDuration(duration, unit), 12, true)}
            </p>
          </div>
          <MergeEndButton hidden={!mergeOption} />
          <Handle
            className={stylesCardButtons["handle--hidden"]}
            type="source"
            position={Position.Bottom}
            isConnectable={false}
            isConnectableEnd={false}
          />
        </div>
        <QIPRContainer onClick={() => handleClickCard()} tasks={tasks} />
      </div>
      {userCanEdit && renderCardButtons()}
    </div>
  );
};
