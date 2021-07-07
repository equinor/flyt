import { Button, Icon } from "@equinor/eds-core-react";
import { IconData } from "@equinor/eds-icons";
import React from "react";

export function LinkIcon(props: {
  helpText: string;
  icon: IconData;
  link: string;
  style?: React.CSSProperties;
}): JSX.Element {
  return (
    <a href={props.link} className="href" target="_blank" rel="noreferrer">
      <Button variant={"ghost_icon"} title={props.helpText} style={props.style}>
        <Icon data={props.icon} />
      </Button>
    </a>
  );
}
