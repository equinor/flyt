import { useEffect, useState } from "react";
import { Connection, Handle, NodeProps, Position, useStore } from "reactflow";
import { formatNodeText } from "./utils/formatNodeText";

import styles from "./Node.module.scss";
import stylesNodeButtons from "./NodeButtons.module.scss";
import { NodeButtonsContainer } from "./NodeButtonsContainer";
import { SubActivityButton } from "./SubActivityButton";
import { ChoiceButton } from "./ChoiceButton";
import { WaitingButton } from "./WaitingButton";
import { vsmObjectTypes } from "types/vsmObjectTypes";
import { MergeEndButton } from "./MergeEndButton";
import { MergeStartButton } from "./MergeStartButton";
import { NodeData } from "types/NodeData";

export const ChoiceNode = ({ data, dragging }: NodeProps<NodeData>) => {
  const [hovering, setHovering] = useState(false);
  const connectionNodeId = useStore((state) => state.connectionNodeId);

  const {
    id,
    description,
    type,
    isDropTarget,
    isValidDropTarget,
    handleClickNode,
    isChoiceChild,
    handleClickAddNode,
    userCanEdit,
    children,
    mergeOption,
    merging,
    handleMerge,
    mergeable,
  } = data;

  const size = 132;
  const lastChild = children[children?.length - 1];

  useEffect(() => {
    setHovering(false);
  }, [dragging, connectionNodeId]);

  return (
    <div
      onMouseEnter={() => {
        !dragging && setHovering(true);
      }}
      onMouseLeave={() => setHovering(false)}
    >
      <div
        onClick={() => handleClickNode()}
        className={`${hovering && !merging && styles["container--hover"]} ${
          styles[
            isDropTarget && isValidDropTarget
              ? "node--validDropTarget"
              : isValidDropTarget === false
              ? "node--invalidDropTarget"
              : ""
          ]
        }`}
      >
        <svg
          style={{ display: "block", overflow: "visible" }}
          width={size}
          height={size}
        >
          <path
            d={`M0,${size / 2} L${size / 2},0 L${size},${size / 2} L${
              size / 2
            },${size} z`}
            {...{ fill: "#FDD835" }}
          />
        </svg>
        <div className={styles["node__choice__container"]}>
          {description ? (
            <p
              style={{
                width: 90,
                marginLeft: 20,
                overflowWrap: "break-word",
              }}
              className={styles.text}
            >
              {formatNodeText(description, 50)}
            </p>
          ) : (
            <p
              style={{ width: 100, marginLeft: 15 }}
              className={`${styles.text} ${styles["text--placeholder"]}`}
            >
              {formatNodeText(type)}
            </p>
          )}
        </div>
        <MergeEndButton hidden={!mergeOption} />
        <Handle
          className={stylesNodeButtons.handle}
          type="source"
          position={Position.Bottom}
          isConnectable={false}
          isConnectableEnd={false}
        />
      </div>
      {hovering && userCanEdit && !merging && (
        <>
          <NodeButtonsContainer position={Position.Bottom}>
            <SubActivityButton
              onClick={() =>
                handleClickAddNode(
                  lastChild || id,
                  vsmObjectTypes.subActivity,
                  lastChild ? Position.Right : Position.Bottom
                )
              }
            />
            <ChoiceButton
              onClick={() =>
                handleClickAddNode(
                  lastChild || id,
                  vsmObjectTypes.choice,
                  lastChild ? Position.Right : Position.Bottom
                )
              }
            />
            <WaitingButton
              onClick={() =>
                handleClickAddNode(
                  lastChild || id,
                  vsmObjectTypes.waiting,
                  lastChild ? Position.Right : Position.Bottom
                )
              }
            />
            {mergeable && (
              <MergeStartButton
                onConnect={(e: Connection) => handleMerge(e.source, e.target)}
              />
            )}
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
      )}
    </div>
  );
};
