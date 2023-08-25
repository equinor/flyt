import React from "react";
import styles from "./CardButtons.module.scss";
import { CardButton } from "./../../interfaces/CardButton";
import ChoiceButtonIcon from "../../public/ChoiceButton/ChoiceButtonIcon.svg";

export const ChoiceButton = (props: CardButton) => (
  <div className={styles.cardButtonContainer}>
    <img
      src={ChoiceButtonIcon.src}
      onClick={() => props.onClick()}
      title="Choice"
      className={styles.cardButton}
    />
  </div>
);
