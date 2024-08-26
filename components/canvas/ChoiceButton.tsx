import styles from "./NodeButtons.module.scss";
import { NodeButton } from "../../types/NodeButton";
import ChoiceButtonIcon from "../../public/NodeButtons/ChoiceButtonIcon.svg";

export const ChoiceButton = ({ onClick, disabled }: NodeButton) => (
  <div
    className={
      styles[
        `${
          disabled ? "nodeButton__container--disabled" : "nodeButton__container"
        }`
      ]
    }
    onClick={() => !disabled && onClick()}
    title="Choice"
  >
    <img
      src={ChoiceButtonIcon.src}
      className={styles[`${disabled ? "nodeButton--disabled" : "nodeButton"}`]}
    />
  </div>
);
