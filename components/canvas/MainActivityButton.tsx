import styles from "./NodeButtons.module.scss";
import { NodeButton } from "../../types/NodeButton";
import MainActivityButtonIcon from "../../public/NodeButtons/MainActivityButtonIcon.svg";

export const MainActivityButton = (props: NodeButton) => (
  <div
    className={styles["nodeButton--container"]}
    onClick={() => props.onClick()}
    title="Main Activity"
  >
    <img src={MainActivityButtonIcon.src} className={styles.nodeButton} />
  </div>
);
