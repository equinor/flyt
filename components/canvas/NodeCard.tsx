import styles from "./Node.module.scss";

type NodeCard = {
  onClick?: () => void;
  hovering?: boolean;
  highlighted?: boolean;
  selected?: boolean;
  disabled?: boolean;
  children?: JSX.Element[] | JSX.Element;
};

export const NodeCard = ({
  onClick,
  hovering,
  highlighted,
  selected,
  disabled,
  children,
}: NodeCard) => (
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
