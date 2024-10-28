import { ReactNode } from "react";
import styles from "./Node.module.scss";

type NodeCardProps = {
  onClick?: () => void;
  hovering?: boolean;
  highlighted?: boolean;
  selected?: boolean;
  disabled?: boolean;
  children?: ReactNode;
};

export const NodeCard = ({
  onClick,
  hovering,
  highlighted,
  selected,
  disabled,
  children,
}: NodeCardProps) => (
  <div
    className={`
      ${styles.container}
      ${hovering && styles["container--hover"]}
      ${highlighted && styles["node--highlighted"]}
      ${disabled && styles["node--darkened"]}
      ${selected && styles["node--selected"]}
    `}
    onClick={() => !disabled && onClick && onClick()}
  >
    {children}
  </div>
);
