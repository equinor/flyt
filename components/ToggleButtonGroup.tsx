import React from "react";
import { ToggleButton } from "./ToggleButton";
export const ToggleButtonGroup = ({
  children,
  style,
}: {
  children: {
    props: {
      name: string;
      selected: boolean;
      disabled: boolean;
      onClick: () => void;
      disabledTooltip: string;
    };
  }[];
  style?: React.CSSProperties;
}): JSX.Element => {
  return (
    <div style={style}>
      {children.map((child, index) => (
        <ToggleButton
          key={child.props.name}
          name={child.props.name}
          selected={child.props.selected}
          disabled={child.props.disabled}
          onClick={child.props.onClick}
          disabledTooltip={child.props.disabledTooltip}
          first={index === 0}
          last={index === children.length - 1}
        />
      ))}
    </div>
  );
};
