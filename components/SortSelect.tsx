import { useEffect } from "react";

import style from "./SortSelect.module.scss";
import { useRouter } from "next/router";

export const SortSelect = (): JSX.Element => {
  const router = useRouter();

  useEffect(() => {
    if (!router.query.orderBy) {
      router.replace({
        pathname: router.pathname,
        query: {
          ...router.query,
          orderBy: "modified",
        },
      });
    }
  }, []);

  return (
    <select
      className={style.sortSelect}
      defaultValue={router.query.orderBy || "modified"}
      id="SortingMethod"
      name="SortingMethod"
      onChange={(event) => {
        router.replace({
          pathname: router.pathname,
          query: {
            ...router.query,
            orderBy: event.target.value,
          },
        });
      }}
    >
      <option value="name">Alphabetically</option>
      <option value="created">Date created</option>
      <option value="modified">Last modified</option>
    </select>
  );
};
