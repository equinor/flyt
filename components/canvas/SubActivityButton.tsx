import styles from "./NodeButtons.module.scss";
import { NodeButton } from "../../types/NodeButton";
import SubActivityButtonIcon from "../../public/NodeButtons/SubActivityButtonIcon.svg";

export const SubActivityButton = (props: NodeButton) => (
  <div
    className={styles["nodeButton--container"]}
    onClick={() => props.onClick()}
    title="Sub Activity"
  >
    <img src={SubActivityButtonIcon.src} className={styles.nodeButton} />
  </div>
);
