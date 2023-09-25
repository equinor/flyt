import React from "react";
import styles from "./CardButtons.module.scss";
import { CardButton } from "./../../interfaces/CardButton";
import MainActivityButtonIcon from "../../public/CardButtons/MainActivityButtonIcon.svg";

export const MainActivityButton = (props: CardButton) => (
  <div className={styles["cardButton--container"]}>
    <img
      src={MainActivityButtonIcon.src}
      onClick={() => props.onClick()}
      title="Main Activity"
      className={styles.cardButton}
    />
  </div>
);
