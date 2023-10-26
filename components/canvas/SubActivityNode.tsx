import React, { useEffect, useState } from "react";
import { Connection, Handle, Position, useStore } from "reactflow";
import { formatNodeText } from "./utils/formatNodeText";
import { formatDuration } from "types/unitDefinitions";

import styles from "./Node.module.scss";
import stylesNodeButtons from "./NodeButtons.module.scss";
import { SubActivityButton } from "./SubActivityButton";
import { NodeButtonsContainer } from "./NodeButtonsContainer";
import { ChoiceButton } from "./ChoiceButton";
import { WaitingButton } from "./WaitingButton";
import { QIPRContainer } from "./QIPRContainer";
import { NodeData } from "types/NodeData";
import { NodeProps } from "reactflow";
import { vsmObjectTypes } from "types/vsmObjectTypes";
import { MergeStartButton } from "./MergeStartButton";
import { MergeEndButton } from "./MergeEndButton";

export const SubActivityNode = (props: NodeProps<NodeData>) => {
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
    merging,
    mergeOption,
    handleClickNode,
    handleMerge,
    isChoiceChild,
    handleClickAddNode,
    userCanEdit,
  } = props.data;

  useEffect(() => {
    setHovering(false);
  }, [props.dragging, connectionNodeId]);

  const renderNodeButtons = () => {
    if (hovering && !merging) {
      return (
        <>
          <NodeButtonsContainer position={Position.Bottom}>
            <SubActivityButton
              onClick={() =>
                handleClickAddNode(
                  id,
                  vsmObjectTypes.subActivity,
                  Position.Bottom
                )
              }
            />
            <ChoiceButton
              onClick={() =>
                handleClickAddNode(id, vsmObjectTypes.choice, Position.Bottom)
              }
            />
            <WaitingButton
              onClick={() =>
                handleClickAddNode(id, vsmObjectTypes.waiting, Position.Bottom)
              }
            />
            <MergeStartButton
              onConnect={(e: Connection) => handleMerge(e.source, e.target)}
            />
          </NodeButtonsContainer>
          {isChoiceChild && (
            <>
              <NodeButtonsContainer position={Position.Right}>
                <SubActivityButton
                  onClick={() =>
                    handleClickAddNode(
                      id,
                      vsmObjectTypes.subActivity,
                      Position.Right
                    )
                  }
                />
                <ChoiceButton
                  onClick={() =>
                    handleClickAddNode(
                      id,
                      vsmObjectTypes.choice,
                      Position.Right
                    )
                  }
                />
                <WaitingButton
                  onClick={() =>
                    handleClickAddNode(
                      id,
                      vsmObjectTypes.waiting,
                      Position.Right
                    )
                  }
                />
              </NodeButtonsContainer>
              <NodeButtonsContainer position={Position.Left}>
                <SubActivityButton
                  onClick={() =>
                    handleClickAddNode(
                      id,
                      vsmObjectTypes.subActivity,
                      Position.Left
                    )
                  }
                />
                <ChoiceButton
                  onClick={() =>
                    handleClickAddNode(id, vsmObjectTypes.choice, Position.Left)
                  }
                />
                <WaitingButton
                  onClick={() =>
                    handleClickAddNode(
                      id,
                      vsmObjectTypes.waiting,
                      Position.Left
                    )
                  }
                />
              </NodeButtonsContainer>
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
          onClick={() => handleClickNode()}
          className={`${styles.node} ${styles["node--subactivity"]} ${
            styles[
              isDropTarget && isValidDropTarget
                ? "node--validDropTarget"
                : isValidDropTarget === false
                ? "node--invalidDropTarget"
                : ""
            ]
          }`}
        >
          <div className={styles["node__description-container"]}>
            {description ? (
              <p className={styles.text}>{formatNodeText(description, 70)}</p>
            ) : (
              <p className={`${styles.text} ${styles["text--placeholder"]}`}>
                {formatNodeText(type, 70)}
              </p>
            )}
          </div>
          <div className={styles["node__role-container"]}>
            <p className={styles.text}>
              {formatNodeText(role ?? "", 16, true)}
            </p>
          </div>
          <div className={styles["node__time-container"]}>
            <p className={styles.text}>
              {formatNodeText(formatDuration(duration, unit), 12, true)}
            </p>
          </div>
          <MergeEndButton hidden={!mergeOption} />
          <Handle
            className={stylesNodeButtons["handle--hidden"]}
            type="source"
            position={Position.Bottom}
            isConnectable={false}
            isConnectableEnd={false}
          />
        </div>
        <QIPRContainer onClick={() => handleClickNode()} tasks={tasks} />
      </div>
      {userCanEdit && renderNodeButtons()}
    </div>
  );
};
