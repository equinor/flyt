import React from "react";
export const ToggleButtonGroup = (props: {
  children: JSX.Element[];
}): JSX.Element => (
  <div
    style={{
      height: 36,
      borderRadius: 4,
      border: "2px solid #007079",
    }}
  >
    {props.children}
  </div>
);
