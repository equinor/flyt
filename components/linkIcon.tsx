import { Button, Icon } from "@equinor/eds-core-react";
import React from "react";

export function LinkIcon(props: {
  helpText: string;
  iconName: string;
  link: string;
  style?: React.CSSProperties;
}): JSX.Element {
  return (
    <a href={props.link} className="href" target="_blank" rel="noreferrer">
      <Button variant={"ghost_icon"} title={props.helpText} style={props.style}>
        <Icon name={props.iconName} />
      </Button>
    </a>
  );
}
