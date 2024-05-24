import { MouseEventHandler } from "react";
import styles from "./Node.module.scss";

type NodeShape = {
  shape: "square" | "rhombus";
  color: string;
  width: number;
  height: number;
  children: JSX.Element | JSX.Element[];
  onMouseEnter?: MouseEventHandler<HTMLDivElement>;
  onMouseLeave?: MouseEventHandler<HTMLDivElement>;
};

export const NodeShape = ({
  shape,
  color,
  width,
  height,
  children,
  onMouseEnter,
  onMouseLeave,
}: NodeShape) => {
  const square = (
    <div
      style={{ height: height, width: width }}
      className={`${styles["node-shape-container"]} ${styles["node-shape-container--square"]}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div
        className={`${styles["node-shape--square"]}`}
        style={{ backgroundColor: color }}
      >
        {children}
      </div>
    </div>
  );

  const rhombus = (
    <div
      style={{ height: height, width: width }}
      className={styles["node-shape-container"]}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div
        className={`${styles["node-shape--rhombus"]} `}
        style={{ backgroundColor: color }}
      >
        {children}
      </div>
    </div>
  );

  switch (shape) {
    case "square":
      return square;
    case "rhombus":
      return rhombus;
    default:
      return square;
  }
};
