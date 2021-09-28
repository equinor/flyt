import { useRouter } from "next/router";
import { Search } from "@equinor/eds-core-react";
import { debounce } from "../utils/debounce";
import React from "react";
import styles from "./SearchField.module.scss";

export function SearchField() {
  const router = useRouter();
  const handleSearch = (searchQuery: string) => {
    router.query.searchQuery = searchQuery;
    router.replace(router);
  };

  return (
    <Search
      aria-label="search"
      id="searchProjects"
      placeholder="Search content"
      className={styles.searchField}
      onChange={(e) => {
        debounce(() => handleSearch(`${e.target.value}`), 500, "projectSearch");
      }}
    />
  );
}
