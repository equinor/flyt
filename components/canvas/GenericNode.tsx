import { NodeData } from "types/NodeData";
import { useState } from "react";
import { Handle, NodeProps, Position } from "reactflow";
import { formatNodeText } from "./utils/formatNodeText";

import styles from "./Node.module.scss";
import stylesNodeButtons from "./NodeButtons.module.scss";
import { NodeButtonsContainer } from "./NodeButtonsContainer";
import { MainActivityButton } from "./MainActivityButton";
import { QIPRContainer } from "./QIPRContainer";
import { vsmObjectTypes } from "types/vsmObjectTypes";

export function GenericNode(props: NodeProps<NodeData>) {
  const [hovering, setHovering] = useState(false);

  const {
    id,
    description,
    type,
    tasks,
    isValidDropTarget,
    isDropTarget,
    handleClickNode,
    handleClickAddNode,
    userCanEdit,
    merging,
  } = props.data;

  const renderNodeButtons = () => {
    if (hovering && !merging) {
      if (type === "Input") {
        return (
          <NodeButtonsContainer position={Position.Right}>
            <MainActivityButton
              onClick={() =>
                handleClickAddNode(
                  id,
                  vsmObjectTypes.mainActivity,
                  Position.Right
                )
              }
            />
          </NodeButtonsContainer>
        );
      } else if (type === "Output") {
        return (
          <NodeButtonsContainer position={Position.Left}>
            <MainActivityButton
              onClick={() =>
                handleClickAddNode(
                  id,
                  vsmObjectTypes.mainActivity,
                  Position.Left
                )
              }
            />
          </NodeButtonsContainer>
        );
      }
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
          className={`${styles.node} ${styles["node--generic"]} ${
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
          <Handle
            className={stylesNodeButtons["handle--hidden"]}
            type="target"
            position={Position.Top}
            isConnectable={false}
          />
        </div>
        <QIPRContainer onClick={() => handleClickNode()} tasks={tasks} />
      </div>
      {userCanEdit && renderNodeButtons()}
    </div>
  );
}
