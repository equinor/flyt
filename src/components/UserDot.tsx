import { lightOrDark } from "../utils/LightOrDark";
import React from "react";

const names: Array<{ name: string; color: string }> = [];

function randomColor(): string {
  const color = "#" + Math.floor(Math.random() * 16777215).toString(16);
  //Check if it generated a valid hex color. If not, try again
  return /^#[0-9A-F]{6}$/i.test(color) ? color : randomColor();
}

export function UserDot(props: { name: string }): JSX.Element {
  const existingName = names.find((n) => n.name === props.name);
  const color = existingName?.color ? existingName.color : randomColor();
  if (!existingName) {
    names.push({ name: props.name, color });
  }

  return (
    <div
      className="label"
      style={{
        borderRadius: 24,
        display: "flex",
        marginLeft: 8,
        alignItems: "center",
        justifyContent: "center",
        height: 24,
        width: 24,
        backgroundColor: color,
      }}
    >
      <p
        style={{
          fontFamily: "Equinor",
          color: lightOrDark(color) === "dark" ? "white" : "black",
        }}
      >
        {props.name[0].toUpperCase()}
      </p>
    </div>
  );
}
