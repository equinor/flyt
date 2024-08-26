import styles from "./NodeButtons.module.scss";
import { NodeButton } from "../../types/NodeButton";
import MainActivityButtonIcon from "../../public/NodeButtons/MainActivityButtonIcon.svg";

export const MainActivityButton = ({ onClick, disabled }: NodeButton) => (
  <div
    className={
      styles[
        `${
          disabled ? "nodeButton__container--disabled" : "nodeButton__container"
        }`
      ]
    }
    onClick={() => !disabled && onClick()}
    title="Main Activity"
  >
    <img
      src={MainActivityButtonIcon.src}
      className={styles[`${disabled ? "nodeButton--disabled" : "nodeButton"}`]}
    />
  </div>
);
