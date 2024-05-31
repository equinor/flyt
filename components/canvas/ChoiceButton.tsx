import styles from "./NodeButtons.module.scss";
import { NodeButton } from "../../types/NodeButton";
import ChoiceButtonIcon from "../../public/NodeButtons/ChoiceButtonIcon.svg";

export const ChoiceButton = (props: NodeButton) => (
  <div
    className={styles["nodeButton__container"]}
    onClick={props.onClick}
    title="Choice"
  >
    <img src={ChoiceButtonIcon.src} className={styles.nodeButton} />
  </div>
);
