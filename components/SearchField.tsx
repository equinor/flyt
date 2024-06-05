import styles from "./SearchField.module.scss";
import { Search } from "@equinor/eds-core-react";
import { debounce } from "@/utils/debounce";
import { useRouter } from "next/router";
import { NextParsedUrlQuery } from "next/dist/server/request-meta";

export function SearchField() {
  function removeEmpty(obj: NextParsedUrlQuery) {
    Object.keys(obj).forEach((key) => {
      if (obj[key] === "") {
        delete obj[key];
      }
    });
    return obj;
  }

  const router = useRouter();
  const handleSearch = (searchQuery: string) => {
    void router.replace({
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
