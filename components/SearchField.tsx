import React from "react";
import styles from "./SearchField.module.scss";
import { Search } from "@equinor/eds-core-react";
import { debounce } from "../utils/debounce";
import removeEmpty from "utils/removeEmpty";
import { useRouter } from "next/router";

export function SearchField(): JSX.Element {
  const router = useRouter();
  const handleSearch = (searchQuery: string) => {
    router.replace({
      query: removeEmpty({ ...router.query, q: searchQuery }),
    });
  };

  return (
    <Search
      aria-label="Search for process with name"
      placeholder="Search by process name"
      defaultValue={router.query.q}
      className={styles.searchBar}
      onChange={(e) => {
        debounce(() => handleSearch(`${e.target.value}`), 500, "projectSearch");
      }}
    />
  );
}
