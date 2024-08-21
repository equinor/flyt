import styles from "./NodeButtons.module.scss";
import { NodeButton } from "../../types/NodeButton";
import SubActivityButtonIcon from "../../public/NodeButtons/SubActivityButtonIcon.svg";

export const SubActivityButton = ({ onClick, disabled }: NodeButton) => (
  <div
    className={
      styles[
        `${
          disabled ? "nodeButton__container--disabled" : "nodeButton__container"
        }`
      ]
    }
    onClick={() => !disabled && onClick()}
    title="Sub Activity"
  >
    <img
      src={SubActivityButtonIcon.src}
      className={styles[`${disabled ? "nodeButton--disabled" : "nodeButton"}`]}
    />
  </div>
);
