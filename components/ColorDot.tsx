import React from "react";

export function ColorDot(props: { color: string }): JSX.Element {
  return (
    <div
      style={{
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: props.color,
      }}
    />
  );
}
