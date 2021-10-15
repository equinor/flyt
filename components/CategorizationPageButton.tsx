import React from "react";
import { Icon, Tooltip } from "@equinor/eds-core-react";
import { category } from "@equinor/eds-icons";
import style from "./ParkingLotButton.module.scss";
import { useRouter } from "next/router";
import useWindowSize, { WindowSize } from "../hooks/useWindowSize";
import { TooltipImproved } from "./TooltipImproved";

/**
 * NB. Currently only adjusted for use in the canvas. path: "baseURL/process/{id}"
 * @constructor
 */
export const CategorizationPageButton = (props: {
  userCanEdit: boolean;
}): JSX.Element => {
  const router = useRouter();
  const windowSize: WindowSize = useWindowSize();

  function getLeft() {
    const bigScreen = windowSize.width >= 768;

    const iconWidth = 54;
    const rightSide = windowSize.width - iconWidth - 50;
    const center = windowSize.width / 2;

    if (!props.userCanEdit) {
      return bigScreen ? rightSide : center - iconWidth / 2;
    }

    // Make sure to factor in the toolbox
    const toolBoxPadding = 100;
    return bigScreen ? rightSide : center + toolBoxPadding;
  }

  return (
    <TooltipImproved title="Categorize PQIs">
      <div
        style={{ left: getLeft() }}
        onClick={() => router.push(`${router.asPath}/categories`)}
        className={style.wrapper}
      >
        <div className={style.iconBorder}>
          <Icon data={category} color={"#007079"} />
        </div>
      </div>
    </TooltipImproved>
  );
};
5;
