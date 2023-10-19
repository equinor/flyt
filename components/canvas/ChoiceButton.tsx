import styles from "./CardButtons.module.scss";
import { CardButton } from "../../types/CardButton";
import ChoiceButtonIcon from "../../public/CardButtons/ChoiceButtonIcon.svg";

export const ChoiceButton = (props: CardButton) => (
  <div
    className={styles["cardButton--container"]}
    onClick={() => props.onClick()}
    title="Choice"
  >
    <img src={ChoiceButtonIcon.src} className={styles.cardButton} />
  </div>
);
