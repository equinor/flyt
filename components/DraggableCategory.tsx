import { getColor } from "../utils/getColor";
import styles from "./DraggableCategory.module.scss";
import { ColorDot } from "./ColorDot";
import React from "react";

export function DraggableCategory(props: { text: string }): JSX.Element {
  const color = getColor(props.text);
  return (
    <div
      draggable={true}
      onClick={() => alert("CLICKED")}
      onDragStart={(ev) => {
        ev.dataTransfer.setData(
          "text/plain",
          JSON.stringify({
            text: props.text,
            color: color,
          })
        );
      }}
      className={styles.category}
    >
      <ColorDot color={color} />
      <p>{props.text}</p>
      {/*<Icon data={close} />*/}
      {/*  Todo: figure out what the close icon should do...*/}
    </div>
  );
}
