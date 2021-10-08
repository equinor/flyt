import React from "react";
import style from "./SortSelect.module.scss";
import { useRouter } from "next/router";

export const SortSelect = (): JSX.Element => {
  const router = useRouter();

  return (
    <select
      className={style.sortSelect}
      defaultValue={router.query.orderBy}
      id="SortingMethod"
      name="SortingMethod"
      onChange={(event) => {
        router.query.orderBy = event.target.value;
        router.replace(router);
      }}
    >
      <option value="name">Alphabetically</option>
      <option value="created">Date created</option>
      <option value="modified">Last modified</option>
    </select>
  );
};
