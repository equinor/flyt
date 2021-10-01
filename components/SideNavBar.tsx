import React from "react";
import {
  dashboard,
  person,
  favorite_outlined,
  search,
} from "@equinor/eds-icons";
import styles from "./SideNavBar.module.scss";
import SideNavBarElement from "./SideNavBarElement";

export default function SideNavBar(): JSX.Element {
  return (
    <div className={styles.container}>
      <SideNavBarElement
        icon={dashboard}
        title="See all processes"
        pathname="/projects"
      />
      <SideNavBarElement
        icon={person}
        title="See my processes"
        pathname="/projects/mine"
      />
      <SideNavBarElement
        icon={favorite_outlined}
        title="See my favourite processes"
        pathname="/projects/favourite"
      />
    </div>
  );
}
