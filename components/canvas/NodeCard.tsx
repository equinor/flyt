import { ReactNode } from "react";
import styles from "./Node.module.scss";

type NodeCardProps = {
  onClick?: () => void;
  hovering?: boolean;
  highlighted?: boolean;
  darkened?: boolean;
  children?: ReactNode;
};

export const NodeCard = ({
  onClick,
  hovering,
  highlighted,
  darkened,
  children,
}: NodeCardProps) => (
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
    {children}
  </div>
);
