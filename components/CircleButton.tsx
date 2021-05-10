import styles from "./CircleButton.module.scss";
import React from "react";

export function CircleButton(props: {
  symbol: string;
  onClick: () => void;
  disabled: boolean;
}): JSX.Element {
  if (props.disabled)
    return (
      <span title="Disabled" className={styles.addButtonDisabled}>
        {props.symbol}
      </span>
    );
  return (
    <span onClick={props.onClick} className={styles.addButton}>
      {props.symbol}
    </span>
  );
}
