import React, { useEffect, useState } from "react";
import { Connection, Handle, Position, useStore } from "reactflow";
import { formatCardText } from "./utils/FormatCardText";
import { formatDuration } from "types/unitDefinitions";
import { Icon } from "@equinor/eds-core-react";
import { time as timeIcon } from "@equinor/eds-icons";

import styles from "./Card.module.scss";
import stylesCardButtons from "./CardButtons.module.scss";
import { CardButtonsContainer } from "./CardButtonsContainer";
import { SubActivityButton } from "./SubActivityButton";
import { ChoiceButton } from "./ChoiceButton";
import { WaitingButton } from "./WaitingButton";
import { QIPRContainer } from "./QIPRContainer";
import { NodeData } from "interfaces/NodeData";
import { Node } from "reactflow";
import { vsmObjectTypes } from "types/vsmObjectTypes";
import { MergeStartButton } from "./MergeStartButton";
import { MergeEndButton } from "./MergeEndButton";

export const WaitingCard = (props: Node<NodeData>) => {
  const [hovering, setHovering] = useState(false);
  const connectionNodeId = useStore((state) => state.connectionNodeId);

  const {
    id,
    duration,
    unit,
    type,
    tasks,
    isValidDropTarget,
    isDropTarget,
    mergeable,
    mergeOption,
    handleClickCard,
    handleMerge,
    merging,
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
              {formatCardText(type, 70)}
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
