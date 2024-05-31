import styles from "./Node.module.scss";

type NodeCard = {
  onClick: () => void;
  hovering?: boolean;
  highlighted?: boolean;
  darkened?: boolean;
  children?: JSX.Element[] | JSX.Element;
};

export const NodeCard = ({
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
    {children}
  </div>
);
