import React from "react";

export function ColorDot(props: { color: string }): JSX.Element {
  return (
    <div
      style={{
        width: 10,
        height: 10,
        borderRadius: 12,
        backgroundColor: props.color,
        border: "solid rgb(247,247,247) 1px",
      }}
    />
  );
}
