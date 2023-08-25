import React from "react";
import styles from "./CardButtons.module.scss";
import { CardButton } from "./../../interfaces/CardButton";
import MainButtonIcon from "../../public/MainButton/MainButtonIcon.svg";

export const MainActivityButton = (props: CardButton) => (
  <div className={styles.cardButtonContainer}>
    <img
      src={MainButtonIcon.src}
      onClick={() => props.onClick()}
      title="Main Activity"
      className={styles.cardButton}
    />
  </div>
);
