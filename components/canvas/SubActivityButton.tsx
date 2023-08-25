import React from "react";
import styles from "./CardButtons.module.scss";
import { CardButton } from "./../../interfaces/CardButton";
import SubActivityButtonIcon from "../../public/SubActivityButton/SubActivityButtonIcon.svg";

export const SubActivityButton = (props: CardButton) => (
  <div className={styles.cardButtonContainer}>
    <img
      src={SubActivityButtonIcon.src}
      onClick={() => props.onClick()}
      title="Sub Activity"
      className={styles.cardButton}
    />
  </div>
);
