import { Task } from "types/Task";
import styles from "./Node.module.scss";
import { QIPRContainer } from "./QIPRContainer";
import { NodeShape } from "./NodeShape";

type NodeCard = {
  shape: "square" | "rhombus";
  color: string;
  height: number;
  width: number;
  tasks?: Task[];
  onClick: () => void;
  hovering?: boolean;
  highlighted?: boolean;
  darkened?: boolean;
  children?: JSX.Element[] | JSX.Element;
};

export const NodeCard = ({
  shape,
  height,
  width,
  color,
  tasks,
  onClick,
  hovering,
  highlighted,
  darkened,
  children,
}: NodeCard) => (
  <div
    className={`${styles.container} ${
      hovering ? styles["container--hover"] : ""
    } ${
      styles[
        highlighted ? "node--highlighted" : darkened ? "node--darkened" : ""
      ]
    }`}
    onClick={onClick}
  >
    <NodeShape shape={shape} color={color} width={width} height={height}>
      {children}
    </NodeShape>
    <QIPRContainer tasks={tasks} />
  </div>
);
