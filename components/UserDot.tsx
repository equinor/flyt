import { lightOrDark } from "../utils/LightOrDark";
import React from "react";
import { randomColor } from "../utils/randomColor";
import styles from "./UserDot.module.scss";

// Memoization of names
const names: Array<{ name: string; color: string }> = [];

export function UserDot(props: { name: string }): JSX.Element {
  const existingName = names.find((n) => n.name === props.name);
  const color = existingName?.color ? existingName.color : randomColor();

  if (!existingName) {
    names.push({ name: props.name, color });
  }

  return (
    <div className={styles.container} style={{ backgroundColor: color }}>
      <p
        style={{
          fontFamily: "Equinor",
          color: lightOrDark(color) === "dark" ? "white" : "black",
        }}
      >
        {props.name && props.name[0].toUpperCase()}
      </p>
    </div>
  );
}
