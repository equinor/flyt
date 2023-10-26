import { useEffect, useState } from "react";
import { Connection, Handle, NodeProps, Position, useStore } from "reactflow";
import { formatNodeText } from "./utils/formatNodeText";

import styles from "./Card.module.scss";
import stylesNodeButtons from "./CardButtons.module.scss";
import { CardButtonsContainer } from "./CardButtonsContainer";
import { SubActivityButton } from "./SubActivityButton";
import { ChoiceButton } from "./ChoiceButton";
import { WaitingButton } from "./WaitingButton";
import { vsmObjectTypes } from "types/vsmObjectTypes";
import { MergeEndButton } from "./MergeEndButton";
import { MergeStartButton } from "./MergeStartButton";
import { NodeData } from "types/NodeData";

export const ChoiceCard = ({ data, dragging }: NodeProps<NodeData>) => {
  const [hovering, setHovering] = useState(false);
  const connectionNodeId = useStore((state) => state.connectionNodeId);

  const {
    id,
    description,
    type,
    isDropTarget,
    isValidDropTarget,
    handleClickCard,
    isChoiceChild,
    handleClickAddCard,
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
        onClick={() => handleClickCard()}
        className={`${hovering && !merging && styles["container--hover"]} ${
          styles[
            isDropTarget && isValidDropTarget
              ? "card--validDropTarget"
              : isValidDropTarget === false
              ? "card--invalidDropTarget"
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
        <div className={styles["card__choice__container"]}>
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
          <CardButtonsContainer position={Position.Bottom}>
            <SubActivityButton
              onClick={() =>
                handleClickAddCard(
                  lastChild || id,
                  vsmObjectTypes.subActivity,
                  lastChild ? Position.Right : Position.Bottom
                )
              }
            />
            <ChoiceButton
              onClick={() =>
                handleClickAddCard(
                  lastChild || id,
                  vsmObjectTypes.choice,
                  lastChild ? Position.Right : Position.Bottom
                )
              }
            />
            <WaitingButton
              onClick={() =>
                handleClickAddCard(
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
          </CardButtonsContainer>
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
      )}
    </div>
  );
};
