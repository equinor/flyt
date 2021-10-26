import React from "react";
import { Icon, Tooltip } from "@equinor/eds-core-react";
import styles from "./SideNavBarElement.module.scss";
import { useRouter } from "next/router";

export default function SideNavBarElement(props: {
  icon;
  title: string;
  pathname: string;
  testId: string;
}): JSX.Element {
  const router = useRouter();
  const pathname = router.pathname;
  const { searchQuery, orderBy } = router.query;
  const isOnCurrentPage = pathname == props.pathname;

  return (
    <Tooltip title={props.title} placement="right">
      <button
        data-test={props.testId}
        style={{ backgroundColor: isOnCurrentPage && "#E6FAEC" }}
        className={styles.iconContainer}
        onClick={() =>
          router.push({
            pathname: props.pathname,
            query: { orderBy, searchQuery },
          })
        }
      >
        <Icon
          data={props.icon}
          className={styles.icon}
          style={{ backgroundColor: "inherit" }}
        ></Icon>
      </button>
    </Tooltip>
  );
}
