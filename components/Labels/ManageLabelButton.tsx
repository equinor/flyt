import React, { useState } from "react";
import { Icon, Scrim } from "@equinor/eds-core-react";
import { tag } from "@equinor/eds-icons";
import style from "../CanvasButton.module.scss";
import { TooltipImproved } from "../TooltipImproved";
import ManageLabelBox from "./ManageLabelBox";

/**
 * NB. Currently only adjusted for use in the canvas. path: "baseURL/process/{id}"
 * @constructor
 */
export const ManageLabelButton = (props: {
  handleClickLabel: () => void;
}): JSX.Element => {
  return (
    <>
      <TooltipImproved title="Manage process labels">
        <button onClick={props.handleClickLabel} className={style.wrapper}>
          <div className={style.iconBorder}>
            <Icon data={tag} color={"#007079"} />
          </div>
        </button>
      </TooltipImproved>
    </>
  );
};
