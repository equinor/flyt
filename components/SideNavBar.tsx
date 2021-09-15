import Link from "next/link";
import React from "react";
import {
  dashboard,
  person,
  favorite_outlined,
  search,
} from "@equinor/eds-icons";
import { Icon } from "@equinor/eds-core-react";
import styles from "./SideNavBar.module.scss";
import { useRouter } from "next/router";

export default function SideNavBar(): JSX.Element {
  const router = useRouter();
  const path = router.asPath;

  return (
    <div className={styles.container}>
      <div
        style={{ backgroundColor: path == "/projects" && "#E6FAEC" }}
        className={styles.iconContainer}
      >
        <Link href={"/projects"}>
          <Icon data={dashboard} className={styles.icon}></Icon>
        </Link>
      </div>
      <div
        style={{ backgroundColor: path == "/projects/favourite" && "#E6FAEC" }}
        className={styles.iconContainer}
      >
        <Link href={"/projects/favourite"}>
          <Icon data={person} className={styles.icon}></Icon>
        </Link>
      </div>
      <div
        style={{ backgroundColor: path == "/projects/myprojects" && "#E6FAEC" }}
        className={styles.iconContainer}
      >
        <Link href={"/projects/myprojects"}>
          <Icon data={favorite_outlined} className={styles.icon}></Icon>
        </Link>
      </div>
      <div
        style={{ backgroundColor: path == "/projects/search" && "#E6FAEC" }}
        className={styles.iconContainer}
      >
        <Link href={"/projects/search"}>
          <Icon data={search} className={styles.icon}></Icon>
        </Link>
      </div>
    </div>
  );
}
