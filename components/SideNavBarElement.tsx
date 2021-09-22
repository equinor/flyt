import React, { useState } from "react";
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
  const [isHovered, setIsHovered] = useState(false);

  const isOnCurrentPage = path == props.href;

  const getBackgroundColor = () => {
    if (isOnCurrentPage) return "#E6FAEC";
    if (isHovered) return "#DADADA";
    return null;
  };
  return (
    <div
      style={{ backgroundColor: getBackgroundColor() }}
      className={styles.iconContainer}
      onMouseEnter={() => {
        setIsHovered(true);
      }}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Tooltip title={props.title} placement="right">
        <Link href={props.href}>
          <Icon data={props.icon} className={styles.icon} />
        </Link>
      </Tooltip>
    </div>
  );
}
