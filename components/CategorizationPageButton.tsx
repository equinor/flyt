import React from "react";
import { Icon } from "@equinor/eds-core-react";
import { category } from "@equinor/eds-icons";
import style from "./CanvasButton.module.scss";
import { useRouter } from "next/router";
import { TooltipImproved } from "./TooltipImproved";

/**
 * NB. Currently only adjusted for use in the canvas. path: "baseURL/process/{id}"
 * @constructor
 */
export const CategorizationPageButton = (): JSX.Element => {
  const router = useRouter();

  return (
    <TooltipImproved title="Categorize PQIR's">
      <button
        onClick={() => router.push(`${router.asPath}/categories`)}
        className={style.wrapper}
      >
        <div className={style.iconBorder}>
          <Icon data={category} color={"#007079"} />
        </div>
      </button>
    </TooltipImproved>
  );
};
