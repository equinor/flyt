import React from "react";
import styles from "./CardButtons.module.scss";
import { CardButton } from "./../../interfaces/CardButton";
import ChoiceButtonIcon from "../../public/CardButtons/ChoiceButtonIcon.svg";

export const ChoiceButton = (props: CardButton) => (
  <img
    src={ChoiceButtonIcon.src}
    className={styles.cardButton}
    onClick={() => props.onClick()}
    title="Choice"
  />
);
