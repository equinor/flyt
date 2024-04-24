import { ReactNode } from "react";
import style from "./WashOutFilter.module.scss";

export const WashOutFilter = (props: { children: ReactNode }): JSX.Element => (
  <div className={style.filter}>{props.children}</div>
);
