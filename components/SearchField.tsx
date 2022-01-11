import { useRouter } from "next/router";
import { Search } from "@equinor/eds-core-react";
import { debounce } from "../utils/debounce";
import React from "react";
import styles from "./SearchField.module.scss";
import removeEmpty from "utils/removeEmpty";

export function SearchField(): JSX.Element {
  const router = useRouter();
  const handleSearch = (searchQuery: string) => {
    router.replace({
      query: removeEmpty({ ...router.query, q: searchQuery }),
    });
  };

  return (
    <Search
      aria-label="search"
      id="searchProjects"
      placeholder="Search by username or title"
      className={styles.searchField}
      defaultValue={router.query.q}
      onChange={(e) => {
        debounce(() => handleSearch(`${e.target.value}`), 500, "projectSearch");
      }}
    />
  );
}
