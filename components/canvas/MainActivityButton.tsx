import styles from "./CardButtons.module.scss";
import { CardButton } from "../../types/CardButton";
import MainActivityButtonIcon from "../../public/CardButtons/MainActivityButtonIcon.svg";

export const MainActivityButton = (props: CardButton) => (
  <div
    className={styles["cardButton--container"]}
    onClick={() => props.onClick()}
    title="Main Activity"
  >
    <img src={MainActivityButtonIcon.src} className={styles.cardButton} />
  </div>
);
