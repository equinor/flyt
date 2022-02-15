import React from "react";
import { IconData } from "@equinor/eds-icons";
import { TooltipImproved } from "../TooltipImproved";
import style from "../ButtonWrapper.module.scss";
import { Icon } from "@equinor/eds-core-react";

/**
 * ButtonWrapper - A wrapper for the button
 * @param props
 * @constructor
 */
export function ButtonWrapper(props: {
  icon: IconData;
  title: string;
  onClick: () => void;
}) {
  return (
    <TooltipImproved title={props.title}>
      <button onClick={props.onClick} className={style.wrapper}>
        <div className={style.iconBorder}>
          <Icon data={props.icon} color={"#007079"} />
        </div>
      </button>
    </TooltipImproved>
  );
}
