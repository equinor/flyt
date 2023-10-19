import { ReactElement } from "react";
import { Tooltip } from "@equinor/eds-core-react";

/**
 * Improved EDS Tooltip - fallback to div with title prop when window is undefined.
 * + disabled prop circumventing the tooltip altogether
 * @param props
 * @constructor
 */
export function TooltipImproved(props: {
  title: string;
  children: ReactElement;
  disabled?: boolean;
}): ReactElement {
  if (props.disabled) return <>{props.children}</>;
  if (typeof window === "undefined") {
    return <div title={props.title}>{props.children}</div>;
  }
  return <Tooltip title={props.title}>{props.children}</Tooltip>;
}
