import React, { useState } from "react";
import { Position } from "reactflow";
import styles from "./CardButtons.module.scss";
import AddCardButtonIcon from "../../public/CardButtons/AddCardButtonIcon.svg";

export const CardButtonsContainer = (props: {
  position: Position;
  children: JSX.Element | JSX.Element[];
}) => {
  const [hovering, setHovering] = useState(false);

  const getClassName = () => {
    switch (props.position) {
      case Position.Top:
        return "cardButtonsContainer--top";
      case Position.Right:
        return "cardButtonsContainer--right";
      case Position.Bottom:
        return "cardButtonsContainer--bottom";
      case Position.Left:
        return "cardButtonsContainer--left";
    }
  };

  return hovering ? (
    <div
      className={`${styles.cardButtonsContainer} ${styles[getClassName()]}`}
      onMouseLeave={() => setHovering(false)}
    >
      {props.children}
    </div>
  ) : (
    <div
      className={`${styles.cardButtonsContainer} ${styles[getClassName()]}`}
      onMouseEnter={() => setHovering(true)}
    >
      <img src={AddCardButtonIcon.src} style={{ margin: "5px" }} />
    </div>
  );
};
