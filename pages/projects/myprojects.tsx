import React from "react";
import SideNavBar from "components/SideNavBar";
import commonStyles from "../../styles/common.module.scss";

export default function Dummy(): JSX.Element {
  return (
    <div className={commonStyles.container}>
      <SideNavBar></SideNavBar>
    </div>
  );
}
