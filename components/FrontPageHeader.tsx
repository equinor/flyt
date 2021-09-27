import { Search, Typography } from "@equinor/eds-core-react";
import React from "react";
import { debounce } from "utils/debounce";
import styles from "./FrontPageHeader.module.scss";
import SortMenu from "./SortMenu";

export default function FrontPageHeader(props: {
  title?: string;
  isSearchPage?: boolean;
  setQueryString?: (any: string) => void;
}): JSX.Element {
  return (
    <div className={styles.container}>
      {!props.isSearchPage ? (
        <Typography variant="h3">{props.title}</Typography>
      ) : (
        <Search
          aria-label="search"
          id="searchProjects"
          placeholder="Search content"
          className={styles.searchField}
          onChange={(e) => {
            debounce(
              () => props.setQueryString(e.target.value),
              500,
              "projectSearch"
            );
          }}
        />
      )}
      <SortMenu />
    </div>
  );
}
