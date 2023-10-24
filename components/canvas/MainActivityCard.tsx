import { useEffect, useState } from "react";
import { Handle, Position } from "reactflow";
import { formatCardText } from "./utils/FormatCardText";
import { MainActivityButton } from "./MainActivityButton";
import { SubActivityButton } from "./SubActivityButton";
import { ChoiceButton } from "./ChoiceButton";
import { WaitingButton } from "./WaitingButton";
import { CardButtonsContainer } from "./CardButtonsContainer";

import styles from "./Card.module.scss";
import stylesCardButtons from "./CardButtons.module.scss";
import { QIPRContainer } from "./QIPRContainer";
import { NodeData } from "types/NodeData";
import { NodeProps } from "reactflow";
import { vsmObjectTypes } from "types/vsmObjectTypes";

export const MainActivityCard = (props: NodeProps<NodeData>) => {
  const [hovering, setHovering] = useState(false);

  const {
    description,
    type,
    tasks,
    id,
    isValidDropTarget,
    isDropTarget,
    handleClickCard,
    handleClickAddCard,
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
          onClick={() => handleClickCard()}
          className={`${styles.card} ${styles["card--mainactivity"]} ${
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
          <Handle
            className={stylesCardButtons["handle--hidden"]}
            type="source"
            position={Position.Bottom}
            isConnectable={false}
          />
        </div>
        <QIPRContainer onClick={() => handleClickCard()} tasks={tasks} />
      </div>
      {hovering && userCanEdit && !merging && (
        <>
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
          </CardButtonsContainer>
        </>
      )}
    </div>
  );
};
