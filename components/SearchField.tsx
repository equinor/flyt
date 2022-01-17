import { Label, Search } from "@equinor/eds-core-react";

import React from "react";
import { debounce } from "../utils/debounce";
import removeEmpty from "utils/removeEmpty";
import styles from "./SearchField.module.scss";
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
      onChange={(e) => {
        debounce(() => handleSearch(`${e.target.value}`), 500, "projectSearch");
      }}
    />
  );
}
