import { NodeData } from "types/NodeData";
import { useState } from "react";
import { Handle, Position } from "reactflow";
import { formatCardText } from "./utils/FormatCardText";

import styles from "./Card.module.scss";
import stylesCardButtons from "./CardButtons.module.scss";
import { CardButtonsContainer } from "./CardButtonsContainer";
import { MainActivityButton } from "./MainActivityButton";
import { QIPRContainer } from "./QIPRContainer";
import { Node } from "reactflow";
import { vsmObjectTypes } from "types/vsmObjectTypes";

export const GenericCard = (props: Node<NodeData>) => {
  const [hovering, setHovering] = useState(false);

  const {
    id,
    description,
    type,
    tasks,
    isValidDropTarget,
    isDropTarget,
    handleClickCard,
    handleClickAddCard,
    userCanEdit,
    merging,
  } = props.data;

  const renderCardButtons = () => {
    if (hovering && !merging) {
      if (type === "Input") {
        return (
          <CardButtonsContainer position={Position.Right}>
            <MainActivityButton
              onClick={() =>
                handleClickAddCard(
                  id,
                  vsmObjectTypes.mainActivity,
                  Position.Right
                )
              }
            />
          </CardButtonsContainer>
        );
      } else if (type === "Output") {
        return (
          <CardButtonsContainer position={Position.Left}>
            <MainActivityButton
              onClick={() =>
                handleClickAddCard(
                  id,
                  vsmObjectTypes.mainActivity,
                  Position.Left
                )
              }
            />
          </CardButtonsContainer>
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
          onClick={() => handleClickCard()}
          className={`${styles.card} ${styles["card--generic"]} ${
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
          <Handle
            className={stylesCardButtons["handle--hidden"]}
            type="target"
            position={Position.Top}
            isConnectable={false}
          />
        </div>
        <QIPRContainer onClick={() => handleClickCard()} tasks={tasks} />
      </div>
      {userCanEdit && renderCardButtons()}
    </div>
  );
};
