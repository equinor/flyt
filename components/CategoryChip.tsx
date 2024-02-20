import { getColor } from "../utils/getColor";
import { lightOrDark } from "../utils/LightOrDark";
import styles from "./CategoryChip.module.scss";
import { Icon } from "@equinor/eds-core-react";
import { close } from "@equinor/eds-icons";
import React from "react";

export function CategoryChip(props: {
  text: string;
  onClickRemove: () => void;
}): JSX.Element {
  const backgroundColor = getColor(props.text);
  const textColor =
    lightOrDark(backgroundColor) === "light" ? "black" : "white";
  return (
    <div
      className={styles.categoryPill}
      style={{ backgroundColor: backgroundColor }}
    >
      <p style={{ color: textColor, overflow: "hidden" }}>{props.text}</p>
      <Icon
        className={styles.removeButton}
        onClick={(e) => {
          e.stopPropagation();
          //props.onClickRemove();
        }}
        style={{
          color: textColor,
          width: 16,
          height: 16,
          minWidth: 16,
          minHeight: 16,
        }}
        data={close}
      />
    </div>
  );
}
