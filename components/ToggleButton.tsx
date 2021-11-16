import React from "react";
import { TooltipImproved } from "./TooltipImproved";
export const ToggleButton = (props: {
  name: string;
  selected: boolean;
  disabled?: boolean;
  onClick?: () => void;
  disabledTooltip?: string;
}): JSX.Element => {
  let textColor = props.selected ? "white" : "#007079";
  if (props.disabled) {
    textColor = "grey";
  }
  let backgroundColor = "white";
  if (props.selected) {
    backgroundColor = "#007079";
  } else if (props.disabled) {
    backgroundColor = "#ccc";
  }

  return (
    <>
      {/* // Only show tooltip if the button is disabled */}
      <TooltipImproved
        disabled={!props.disabled || !props.disabledTooltip}
        title={props.disabledTooltip}
      >
        <button
          disabled={props.disabled}
          style={{
            cursor: props.disabled ? "not-allowed" : "pointer",
            border: "none",
            outline: "none",
            height: 36,
            paddingLeft: 12,
            paddingRight: 12,
            color: textColor,
            backgroundColor,
            fontSize: 14,
            textAlign: "center",
          }}
          onClick={props.onClick}
        >
          {props.name}
        </button>
      </TooltipImproved>
    </>
  );
};
