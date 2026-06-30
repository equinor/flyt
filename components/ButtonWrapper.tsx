import { IconData } from "@equinor/eds-icons";
import style from "./ButtonWrapper.module.scss";
import { Icon, Tooltip } from "@equinor/eds-core-react";
import { CSSProperties } from "react";

export function ButtonWrapper(props: {
  icon: IconData;
  title: string;
  onClick: () => void;
  styles?: CSSProperties;
  disabled?: boolean;
}) {
  return (
    <Tooltip title={props.title}>
      <button
        onClick={props.onClick}
        className={style.button}
        style={props.styles}
        disabled={props.disabled || false}
      >
        <Icon
          data={props.icon}
          color={props.disabled ? "#BEBEBE" : "#007079"}
        />
      </button>
    </Tooltip>
  );
}
