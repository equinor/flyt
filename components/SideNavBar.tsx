import React from "react";
import { dashboard, person, favorite_outlined } from "@equinor/eds-icons";
import styles from "./SideNavBar.module.scss";
import SideNavBarElement from "./SideNavBarElement";

export default function SideNavBar(): JSX.Element {
  return (
    <div className={styles.elements}>
      <SideNavBarElement
        testId={"allProcessesButton"}
        icon={dashboard}
        title="See all processes"
        pathname="/processes"
      />
      <SideNavBarElement
        testId={"myProcessesButton"}
        icon={person}
        title="See my processes"
        pathname="/processes/mine"
      />
      <SideNavBarElement
        testId={"myFavoriteProcessesButton"}
        icon={favorite_outlined}
        title="See my favourite processes"
        pathname="/processes/favourite"
      />
    </div>
  );
}
