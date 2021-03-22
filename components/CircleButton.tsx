import styles from "./CircleButton.module.scss";
import React from "react";

export function CircleButton(props: {
  symbol: string;
  onClick: () => void;
}): JSX.Element {
  return (
    <span onClick={props.onClick} className={styles.addButton}>
      {props.symbol}
    </span>
  );
}
