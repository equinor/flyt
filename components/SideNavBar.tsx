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
        title="All projects"
        pathname="/projects"
      />
      <SideNavBarElement
        icon={person}
        title="My projects"
        pathname="/projects/mine"
      />
      <SideNavBarElement
        icon={favorite_outlined}
        title="Favourite"
        pathname="/projects/favourite"
      />

      <SideNavBarElement
        icon={search}
        title="Search"
        pathname="/projects/search"
      />
    </div>
  );
}
