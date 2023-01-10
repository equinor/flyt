import React from "react";

export const TextCircle = (props) => (
  <div
    style={{
      height: "30px",
      width: "30px",
      background: props.color,
      color: "white",
      fontFamily: "Equinor",
      fontSize: 12,
      fontStyle: "normal",
      fontWeight: "500",
      borderRadius: "50%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    {props.text}
  </div>
);
