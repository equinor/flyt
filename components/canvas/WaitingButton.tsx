import styles from "./NodeButtons.module.scss";
import { NodeButton } from "../../types/NodeButton";
import WaitingButtonIcon from "../../public/NodeButtons/WaitingButtonIcon.svg";

export const WaitingButton = ({ onClick, disabled }: NodeButton) => (
  <div
    className={
      styles[
        `${
          disabled ? "nodeButton__container--disabled" : "nodeButton__container"
        }`
      ]
    }
    onClick={() => !disabled && onClick()}
    title="Waiting"
  >
    <img
      src={WaitingButtonIcon.src}
      className={styles[`${disabled ? "nodeButton--disabled" : "nodeButton"}`]}
    />
  </div>
);
