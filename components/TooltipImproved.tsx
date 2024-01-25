import React, { ReactElement } from "react";
import dynamic from "next/dynamic";
import { Tooltip } from "@equinor/eds-core-react";

/**
 * Improved EDS Tooltip - Disabled SSR
 * + disabled prop circumventing the tooltip altogether
 * @param props
 * @constructor
 */
function TooltipComponent(props: {
  title: string;
  children: ReactElement;
  disabled?: boolean;
}): ReactElement {
  return props.disabled ? (
    <>{props.children}</>
  ) : (
    <Tooltip title={props.title}>{props.children}</Tooltip>
  );
}

export const TooltipImproved = dynamic(
  () => Promise.resolve(TooltipComponent),
  {
    ssr: false,
  }
);
