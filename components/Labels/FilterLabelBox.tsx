import { Button, Icon, Search } from "@equinor/eds-core-react";
import React, { useState } from "react";
import styles from "./FilterLabelBox.module.scss";
import { close } from "@equinor/eds-icons";
import { useQuery } from "react-query";
import { getLabels } from "services/labelsApi";
import { unknownErrorToString } from "utils/isError";
import { useRouter } from "next/router";
import { getUpdatedLabel } from "utils/getUpdatedLabel";
import { debounce } from "utils/debounce";
import { getQueryObject } from "utils/getQueryObject";
import ButtonClearAll from "./ButtonClearAll";

export default function FilterLabelBox(props: {
  handleClose: () => void;
}): JSX.Element {
  const [searchText, setSearchText] = useState("");
  const {
    data: labels,
    isLoading,
    error,
  } = useQuery(["labels", searchText], () => getLabels(searchText));

  return (
    <div className={styles.box}>
      <TopSection title="Filter by label" handleClose={props.handleClose} />
      <SearchSection setSearchText={setSearchText} />
      <LabelSection labels={labels} isLoading={isLoading} error={error} />
    </div>
  );
}

function TopSection(props: {
  title: string;
  handleClose: () => void;
}): JSX.Element {
  return (
    <div className={styles.topSection}>
      <p className={styles.heading}>Filter by label</p>
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

  return (
    <div className={styles.searchSection}>
      <Search
        aria-label="search"
        id="searchProjects"
        placeholder="Search labels"
        className={styles.searchField}
        onChange={(e) => {
          debounce(
            () => setSearchText(`${e.target.value}`),
            500,
            "labelSearch"
          );
        }}
      />
      <ButtonClearAll />
    </div>
  );
}

function LabelSection(props: { labels; isLoading; error }): JSX.Element {
  const { labels, isLoading, error } = props;
  const router = useRouter();

  const handleClick = (id: string) => {
    const rl = getUpdatedLabel(id, router.query.rl);
    const queryObject = getQueryObject(router.query, { rl });
    router.replace({
      pathname: router.pathname,
      query: { ...queryObject },
    });
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
        {`${labels.length}`} {labels.length == 1 ? "label" : "labels"}{" "}
        discovered
      </p>

      <div className={styles.labelContainer}>
        {labels.map((label) => (
          <button
            key={label.id}
            onClick={() => handleClick(label.id.toString())}
          >
            {label.text}
          </button>
        ))}
      </div>
    </div>
  );
}
