import Link from "next/link";
import React, { useState } from "react";
import {
  dashboard,
  person,
  favorite_outlined,
  search,
} from "@equinor/eds-icons";
import { Icon, Tooltip } from "@equinor/eds-core-react";
import styles from "./SideNavBar.module.scss";
import { useRouter } from "next/router";

export default function SideNavBar(): JSX.Element {
  const [isHighlighted, setIsHighlighted] = useState(null);
  const router = useRouter();
  const path = router.asPath;

  return (
    <div className={styles.container}>
      <Tooltip title="All projects" placement="right">
        <div
          onMouseOver={() => setIsHighlighted("all")}
          onMouseLeave={() => setIsHighlighted(null)}
          style={{
            backgroundColor:
              path == "/projects"
                ? "#E6FAEC"
                : isHighlighted === "all"
                ? "#DADADA"
                : null,
          }}
          className={styles.iconContainer}
        >
          <Link href={"/projects"}>
            <Icon data={dashboard} className={styles.icon}></Icon>
          </Link>
        </div>
      </Tooltip>
      <Tooltip title="My projects" placement="right">
        <div
          onMouseOver={() => setIsHighlighted("myprojects")}
          onMouseLeave={() => setIsHighlighted(false)}
          style={{
            backgroundColor:
              path == "/projects/myprojects"
                ? "#E6FAEC"
                : isHighlighted === "myprojects"
                ? "#DADADA"
                : null,
          }}
          className={styles.iconContainer}
        >
          <Link href={"/projects/myprojects"}>
            <Icon data={person} className={styles.icon}></Icon>
          </Link>
        </div>
      </Tooltip>
      <Tooltip title="Favourite" placement="right">
        <div
          onMouseOver={() => setIsHighlighted("favourite")}
          onMouseLeave={() => setIsHighlighted(null)}
          style={{
            backgroundColor:
              path == "/projects/favourite"
                ? "#E6FAEC"
                : isHighlighted === "favourite"
                ? "#DADADA"
                : null,
          }}
          className={styles.iconContainer}
        >
          <Link href={"/projects/favourite"}>
            <Icon data={favorite_outlined} className={styles.icon}></Icon>
          </Link>
        </div>
      </Tooltip>
      <Tooltip title="Search" placement="right">
        <div
          onMouseOver={() => setIsHighlighted("search")}
          onMouseLeave={() => setIsHighlighted(null)}
          style={{
            backgroundColor:
              path == "/projects/search"
                ? "#E6FAEC"
                : isHighlighted === "search"
                ? "#DADADA"
                : null,
          }}
          className={styles.iconContainer}
        >
          <Link href={"/projects/search"}>
            <Icon data={search} className={styles.icon}></Icon>
          </Link>
        </div>
      </Tooltip>
    </div>
  );
}
