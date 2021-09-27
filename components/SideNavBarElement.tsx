import React from "react";
import { Icon, Tooltip } from "@equinor/eds-core-react";
import Link from "next/link";
import styles from "./SideNavBarElement.module.scss";
import { useRouter } from "next/router";

export default function SideNavBarElement(props: {
  icon;
  title: string;
  href: string;
}): JSX.Element {
  const router = useRouter();
  const path = router.asPath;

  const isOnCurrentPage = path == props.href;
  return (
    <div
      style={{ backgroundColor: isOnCurrentPage && "#E6FAEC" }}
      className={styles.iconContainer}
    >
      <Tooltip title={props.title} placement="right">
        <Link href={props.href}>
          <Icon data={props.icon} className={styles.icon} />
        </Link>
      </Tooltip>
    </div>
  );
}
