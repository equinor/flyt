import React from "react";
import styles from "./CardButtons.module.scss";
import { CardButton } from "./../../interfaces/CardButton";
import SubActivityButtonIcon from "../../public/CardButtons/SubActivityButtonIcon.svg";

export const SubActivityButton = (props: CardButton) => (
  <div className={styles["cardButton--container"]}>
    <img
      src={SubActivityButtonIcon.src}
      onClick={() => props.onClick()}
      title="Sub Activity"
      className={styles.cardButton}
    />
  </div>
);
