import React from "react";
import styles from "./CardButtons.module.scss";
import { CardButton } from "./../../interfaces/CardButton";
import WaitingButtonIcon from "../../public/CardButtons/WaitingButtonIcon.svg";

export const WaitingButton = (props: CardButton) => (
  <div className={styles["cardButton--container"]}>
    <img
      src={WaitingButtonIcon.src}
      className={styles.cardButton}
      onClick={() => props.onClick()}
      title="Waiting"
    />
  </div>
);
