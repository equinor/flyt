import React from "react";
import { dashboard, person, favorite_outlined } from "@equinor/eds-icons";
import styles from "./SideNavBar.module.scss";
import SideNavBarElement from "./SideNavBarElement";

export default function SideNavBar(): JSX.Element {
  return (
    <div className={styles.elements}>
      <SideNavBarElement
        ariaLabel={"All processes"}
        icon={dashboard}
        title="See all processes"
        pathname="/processes"
      />
      <SideNavBarElement
        ariaLabel={"My processes"}
        icon={person}
        title="See my processes"
        pathname="/processes/mine"
      />
      <SideNavBarElement
        ariaLabel={"My favorite processes"}
        icon={favorite_outlined}
        title="See my favourite processes"
        pathname="/processes/favourite"
      />
    </div>
  );
}
