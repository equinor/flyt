import React from "react";
import { TooltipImproved } from "./TooltipImproved";
export const ToggleButton = (props: {
  name: string;
  selected: boolean;
  disabled?: boolean;
  onClick?: () => void;
  disabledTooltip?: string;
  first?: boolean;
  last?: boolean;
}): JSX.Element => {
  //Default border
  const border = "2px solid #007079";
  // Do not show top and bottom border on disabled buttons
  const borderTop = props.disabled ? "none" : border;
  const borderBottom = props.disabled ? "none" : border;

  // We only want to round the corners on the first and last button
  let borderRadius = "none";
  if (props.first) {
    // add border radius to the first button
    borderRadius = "4px 0px 0px 4px"; // top-left, bottom-left
  } else if (props.last) {
    // add border radius to the last button
    borderRadius = "0px 4px 4px 0px"; // top-right, bottom-right
  }
  // Make the border width look consistent
  // It should add up to 2px between the elements.
  let borderLeftWidth = props.first ? 2 : 1;
  let borderRightWidth = props.last ? 2 : 1;

  let textColor = props.selected ? "white" : "#007079";
  if (props.disabled) {
    textColor = "#BEBEBE";
    if (props.first) {
      borderLeftWidth = 0;
    }
    if (props.last) {
      borderRightWidth = 0;
    }
  }
  let backgroundColor = "transparent";
  if (props.selected) {
    backgroundColor = "#007079";
  } else if (props.disabled) {
    backgroundColor = "#EAEAEA";
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
            border,
            borderTop,
            borderBottom,
            borderLeftWidth,
            borderRightWidth,
            cursor: props.disabled ? "not-allowed" : "pointer",
            borderRadius,
            // outline: "none",
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
