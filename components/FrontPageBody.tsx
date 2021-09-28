import { Pagination, Typography } from "@equinor/eds-core-react";
import React, { useEffect, useState } from "react";
import styles from "./FrontPageBody.module.scss";
import { ProjectListSection } from "./ProjectListSection";
import { unknownErrorToString } from "../utils/isError";

export default function FrontPageBody(props: {
  showNewProjectButton: boolean;
  itemsPerPage: number;
  query;
  onChangePage: (newPage: number) => void;
}): JSX.Element {
  const [page, setPage] = useState(1);

  const { showNewProjectButton, itemsPerPage, query } = props;
  const { data, isLoading, error } = query;

  const [totalItems, setTotalItems] = useState(0);
  useEffect(() => {
    //Hack so that the pagination does not flicker
    if (data?.totalItems) setTotalItems(data.totalItems);
  }, [data?.totalItems]);

  if (error)
    return (
      <div className={styles.frontPageBody}>
        <Typography variant={"h2"}>{`Couldn't fetch projects`}</Typography>
        <Typography variant={"h3"}>{unknownErrorToString(error)}</Typography>
      </div>
    );

  const handlePageChange = (event, newPage) => {
    props.onChangePage(newPage);
    setPage(newPage);
  };

  return (
    <div className={styles.frontPageBody}>
      <ProjectListSection
        projects={data?.projects}
        isLoading={isLoading}
        expectedNumberOfProjects={itemsPerPage}
        showNewProjectButton={showNewProjectButton}
      />
      <div className={styles.frontPageFooter}>
        {itemsPerPage < totalItems && (
          <Pagination
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            defaultValue={page}
            onChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
}
