import React from "react";
import { ToggleButton } from "./ToggleButton";
export const ToggleButtonGroup = (props: {
  children: {
    props: {
      name: string;
      selected: boolean;
      disabled: boolean;
      onClick: () => void;
      disabledTooltip: string;
    };
  }[];
}): JSX.Element => {
  return (
    <>
      {props.children.map((child, index) => (
        <ToggleButton
          key={child.props.name}
          name={child.props.name}
          selected={child.props.selected}
          disabled={child.props.disabled}
          onClick={child.props.onClick}
          disabledTooltip={child.props.disabledTooltip}
          first={index === 0}
          last={index === props.children.length - 1}
        />
      ))}
    </>
  );
};
