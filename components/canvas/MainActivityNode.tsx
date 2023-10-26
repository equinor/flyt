import { useEffect, useState } from "react";
import { Handle, Position } from "reactflow";
import { formatNodeText } from "./utils/formatNodeText";
import { MainActivityButton } from "./MainActivityButton";
import { SubActivityButton } from "./SubActivityButton";
import { ChoiceButton } from "./ChoiceButton";
import { WaitingButton } from "./WaitingButton";
import { NodeButtonsContainer } from "./NodeButtonsContainer";

import styles from "./Node.module.scss";
import stylesNodeButtons from "./NodeButtons.module.scss";
import { QIPRContainer } from "./QIPRContainer";
import { NodeData } from "types/NodeData";
import { NodeProps } from "reactflow";
import { vsmObjectTypes } from "types/vsmObjectTypes";

export const MainActivityNode = (props: NodeProps<NodeData>) => {
  const [hovering, setHovering] = useState(false);

  const {
    description,
    type,
    tasks,
    id,
    isValidDropTarget,
    isDropTarget,
    handleClickNode,
    handleClickAddNode,
    userCanEdit,
    merging,
  } = props.data;

  useEffect(() => {
    setHovering(false);
  }, [props.dragging]);

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
          className={`${styles.node} ${styles["node--mainactivity"]} ${
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
          <Handle
            className={stylesNodeButtons["handle--hidden"]}
            type="source"
            position={Position.Bottom}
            isConnectable={false}
          />
        </div>
        <QIPRContainer onClick={() => handleClickNode()} tasks={tasks} />
      </div>
      {hovering && userCanEdit && !merging && (
        <>
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
          </NodeButtonsContainer>
        </>
      )}
    </div>
  );
};
