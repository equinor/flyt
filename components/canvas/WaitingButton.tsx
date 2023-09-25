import React from "react";
import styles from "./CardButtons.module.scss";
import { CardButton } from "./../../interfaces/CardButton";
import WaitingButtonIcon from "../../public/CardButtons/WaitingButtonIcon.svg";

export const WaitingButton = (props: CardButton) => (
  <div
    className={styles["cardButton--container"]}
    onClick={() => props.onClick()}
    title="Waiting"
  >
    <img src={WaitingButtonIcon.src} className={styles.cardButton} />
  </div>
);
