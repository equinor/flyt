import { Pagination, Typography } from "@equinor/eds-core-react";
import { useEffect, useState } from "react";
import styles from "../pages/processes/FrontPage.module.scss";
import { ProjectListSection } from "./ProjectListSection";
import { unknownErrorToString } from "@/utils/isError";
import { UseQueryResult } from "react-query";
import { Project } from "@/types/Project";

export function FrontPageBody(props: {
  showNewProcessButton: boolean;
  itemsPerPage: number;
  query: UseQueryResult<{ projects: Project[]; totalItems: number }, unknown>;
  onChangePage: (newPage: number) => void;
}) {
  const [page, setPage] = useState(1);

  const { showNewProcessButton, itemsPerPage, query } = props;
  const { data, isLoading, error } = query;

  const [totalItems, setTotalItems] = useState(0);
  useEffect(() => {
    //Hack so that the pagination does not flicker
    if (data && !isLoading && !error) setTotalItems(data.totalItems);
  }, [data]);

  if (error)
    return (
      <div className={styles.frontPageBody}>
        <Typography variant={"h2"}>{`Couldn't fetch projects`}</Typography>
        <Typography variant={"h3"}>{unknownErrorToString(error)}</Typography>
      </div>
    );

  const handlePageChange = (_: any, newPage: number) => {
    props.onChangePage(newPage);
    setPage(newPage);
  };

  return (
    <>
      {data?.projects && (
        <ProjectListSection
          projects={data?.projects}
          isLoading={isLoading}
          expectedNumberOfProjects={itemsPerPage}
          showNewProcessButton={showNewProcessButton}
        />
      )}
      <div className={styles.footer}>
        {itemsPerPage < totalItems && (
          <Pagination
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            defaultValue={page}
            onChange={handlePageChange}
          />
        )}
      </div>
    </>
  );
}
