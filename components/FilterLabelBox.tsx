import { Button, Chip, Icon, Search } from "@equinor/eds-core-react";
import React from "react";
import styles from "./FilterLabelBox.module.scss";
import { close } from "@equinor/eds-icons";
import { useQuery } from "react-query";
import { getLabels } from "services/labelsApi";
import { unknownErrorToString } from "utils/isError";

export default function FilterLabelBox(props: {
  handleClose: () => void;
}): JSX.Element {
  const {
    data: labels,
    isLoading,
    error,
  } = useQuery(["labels"], () => getLabels());

  return (
    <div className={styles.box}>
      <TopSection title="Filter by label" handleClose={props.handleClose} />
      <SearchSection />
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
      <p className={styles.heading}>Filter by users</p>
      <Button variant={"ghost_icon"} onClick={props.handleClose}>
        <Icon data={close} />
      </Button>
    </div>
  );
}

function SearchSection(): JSX.Element {
  return (
    <div className={styles.searchSection}>
      <Search
        aria-label="search"
        id="searchProjects"
        placeholder="Search labels"
        className={styles.searchField}
      />
    </div>
  );
}

function LabelSection(props: { labels; isLoading; error }): JSX.Element {
  const { labels, isLoading, error } = props;

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{unknownErrorToString(error)}</p>;
  }

  return (
    <div className={styles.labelSection}>
      {labels.map((label) => (
        <Chip key={label.id} className={styles.chip}>
          {label.text}
        </Chip>
      ))}
    </div>
  );
}
