import React from "react";
import styles from "./CardButtons.module.scss";
import { CardButton } from "./../../interfaces/CardButton";
import WaitingButtonIcon from "../../public/CardButtons/WaitingButtonIcon.svg";

export const WaitingButton = (props: CardButton) => (
  <div className={styles.cardButtonContainer}>
    <img
      src={WaitingButtonIcon.src}
      onClick={() => props.onClick()}
      title="Waiting"
      className={styles.cardButton}
    />
  </div>
);
