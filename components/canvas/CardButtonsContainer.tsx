import React from "react";
import { Position } from "reactflow";

import styles from "./CardButtons.module.scss";

export const CardButtonsContainer = (props: {
  position: Position;
  children: JSX.Element | JSX.Element[];
}) => {
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

  return (
    <div className={`${styles.cardButtonsContainer} ${styles[getClassName()]}`}>
      {props.children}
    </div>
  );
};
