import React from "react";
import styles from "./CardButtons.module.scss";
import { CardButton } from "./../../interfaces/CardButton";
import MainButtonIcon from "../../public/CardButtons/MainActivityButtonIcon.svg";

export const MainActivityButton = (props: CardButton) => (
  <img
    src={MainButtonIcon.src}
    onClick={() => props.onClick()}
    title="Main Activity"
    className={styles.cardButton}
  />
);
