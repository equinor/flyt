import styles from "./NodeButtons.module.scss";
import { NodeButton } from "../../types/NodeButton";
import WaitingButtonIcon from "../../public/NodeButtons/WaitingButtonIcon.svg";

export const WaitingButton = (props: NodeButton) => (
  <div
    className={styles["nodeButton--container"]}
    onClick={() => props.onClick()}
    title="Waiting"
  >
    <img src={WaitingButtonIcon.src} className={styles.nodeButton} />
  </div>
);
