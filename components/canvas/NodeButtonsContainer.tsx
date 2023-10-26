import { useState, ReactNode } from "react";
import { Position } from "reactflow";
import styles from "./NodeButtons.module.scss";
import AddNodeButtonIcon from "../../public/NodeButtons/AddNodeButtonIcon.svg";

export const NodeButtonsContainer = (props: {
  position: Position;
  children: ReactNode;
}) => {
  const [hovering, setHovering] = useState(false);
  const getClassName = () => {
    switch (props.position) {
      case Position.Top:
        return "nodeButtonsContainer--top";
      case Position.Right:
        return "nodeButtonsContainer--right";
      case Position.Bottom:
        return "nodeButtonsContainer--bottom";
      case Position.Left:
        return "nodeButtonsContainer--left";
    }
  };

  return hovering ? (
    <div
      className={`${styles.nodeButtonsContainer} ${styles[getClassName()]}`}
      onMouseLeave={() => setHovering(false)}
    >
      {props.children}
    </div>
  ) : (
    <div
      className={`${styles.nodeButtonsContainer} ${styles[getClassName()]}`}
      onMouseEnter={() => setHovering(true)}
    >
      <img src={AddNodeButtonIcon.src} style={{ margin: "5px" }} />
    </div>
  );
};
