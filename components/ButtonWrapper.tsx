import React from "react";
import { IconData } from "@equinor/eds-icons";
import style from "./ButtonWrapper.module.scss";
import { Icon, Tooltip } from "@equinor/eds-core-react";

export function ButtonWrapper(props: {
  icon: IconData;
  title: string;
  onClick: () => void;
}) {
  return (
    <Tooltip title={props.title}>
      <button onClick={props.onClick} className={style.button}>
        <Icon data={props.icon} color={"#007079"} />
      </button>
    </Tooltip>
  );
}
