import { Button, Chip, Icon, Search } from "@equinor/eds-core-react";

import { close } from "@equinor/eds-icons";
import { debounce } from "utils/debounce";
import { searchUser } from "services/userApi";
import styles from "./FilterUserBox.module.scss";
import { toggleQueryParam } from "utils/toggleQueryParam";
import { unknownErrorToString } from "utils/isError";
import { useQuery } from "react-query";
import { useRouter } from "next/router";
import { useState } from "react";

export function FilterUserBox(props: { handleClose: () => void }): JSX.Element {
  const [searchText, setSearchText] = useState("");
  const {
    data: users,
    isLoading,
    error,
  } = useQuery(["users", searchText], () => searchUser(searchText));

  return (
    <div className={styles.box}>
      <TopSection handleClose={props.handleClose} />
      <SearchSection setSearchText={setSearchText} />
      <LabelSection labels={users} isLoading={isLoading} error={error} />
    </div>
  );
}

function TopSection(props: { handleClose: () => void }): JSX.Element {
  return (
    <div className={styles.topSection}>
      <p className={styles.heading}>Filter by user</p>
      <Button variant={"ghost_icon"} onClick={props.handleClose}>
        <Icon data={close} />
      </Button>
    </div>
  );
}

function SearchSection(props: {
  setSearchText: (searchText: string) => void;
}): JSX.Element {
  const { setSearchText } = props;
  const router = useRouter();

  return (
    <div className={styles.searchSection}>
      <Search
        aria-label="search"
        id="searchProjects"
        placeholder="Search users"
        autoComplete="off"
        onChange={(e) => {
          debounce(() => setSearchText(`${e.target.value}`), 500, "userSearch");
        }}
      />
      <Button
        color="primary"
        variant="ghost"
        onClick={() =>
          router.replace({
            query: { ...router.query, user: [] },
          })
        }
        style={{ minWidth: "90px" }}
      >
        Clear all
      </Button>
    </div>
  );
}

function LabelSection(props: { labels; isLoading; error }): JSX.Element {
  const { labels, isLoading, error } = props;
  const router = useRouter();

  const isActive = (id: string) => {
    if (router.query.user) {
      return `${router.query.user}`.split(",").some((element) => element == id);
    }
  };

  if (isLoading) {
    return <p>Loading labels...</p>;
  }

  if (error) {
    return <p>{unknownErrorToString(error)}</p>;
  }

  return (
    <div className={styles.labelSection}>
      <p className={styles.labelCounter}>
        {`${labels.length}`} {labels.length == 1 ? "user" : "users"} discovered
      </p>

      <div className={styles.labelContainer}>
        {labels.map((label) => (
          <button
            key={label.pkUser}
            onClick={() => toggleQueryParam("user", label.pkUser, router)}
            style={{ padding: "0", backgroundColor: "#ffffff", border: "none" }}
            className={styles.button}
          >
            <Chip
              variant={isActive(label.pkUser.toString()) ? "active" : null}
              style={{ marginRight: "5px", marginBottom: "10px" }}
            >
              {label.userName}
            </Chip>
          </button>
        ))}
      </div>
    </div>
  );
}
