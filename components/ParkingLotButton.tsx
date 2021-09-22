import React from "react";
import { Icon } from "@equinor/eds-core-react";
import { parking } from "@equinor/eds-icons";
import style from "./ParkingLotButton.module.scss";
import { useRouter } from "next/router";

/**
 * NB. Currently only adjusted for use in the canvas. path: "baseURL/projects/{id}"
 * @constructor
 */
export const ParkingLotButton = (props: {
  userCanEdit: boolean;
}): JSX.Element => {
  const router = useRouter();

  function getLeft() {
    if (props.userCanEdit) {
      // Make sure to factor in the toolbox
      return window.innerWidth >= 768 ? 240 : window.innerWidth / 2 + 100;
    }
    return 56;
  }

  return (
    <div
      style={{ left: getLeft() }}
      onClick={() => router.push(`${router.asPath}/categories`)}
      title={"Categorize PQIs"}
      className={style.wrapper}
    >
      <div className={style.pBorder}>
        <Icon data={parking} color={"#007079"} />
      </div>
    </div>
  );
};
5;
