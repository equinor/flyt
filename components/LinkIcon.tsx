import { Button, Icon } from "@equinor/eds-core-react";
import { IconData } from "@equinor/eds-icons";
import { CSSProperties } from "react";
import { TooltipImproved } from "./TooltipImproved";

export function LinkIcon(props: {
  helpText: string;
  icon: IconData;
  link: string;
  style?: CSSProperties;
}): JSX.Element {
  return (
    <a href={props.link} className="href" target="_blank" rel="noreferrer">
      <TooltipImproved title={props.helpText}>
        <Button variant={"ghost_icon"} style={props.style}>
          <Icon data={props.icon} />
        </Button>
      </TooltipImproved>
    </a>
  );
}
