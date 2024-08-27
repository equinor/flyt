import { Typography } from "@equinor/eds-core-react";
import styles from "../pages/processes/FrontPage.module.scss";
import { ProjectListSection } from "./ProjectListSection";
import { unknownErrorToString } from "@/utils/isError";
import { UseInfiniteQueryResult } from "react-query";
import { Project } from "@/types/Project";

export function InfiniteFrontPageBody(props: {
  showNewProcessButton: boolean;
  query: UseInfiniteQueryResult<{ projects: Project[]; totalItems: number }>;
}) {
  const { showNewProcessButton, query } = props;
  const { data, isLoading, error, isFetchingNextPage } = query;

  if (error) {
    return (
      <div className={styles.frontPageBody}>
        <Typography variant={"h2"}>{`Couldn't fetch projects`}</Typography>
        <Typography variant={"h3"}>{unknownErrorToString(error)}</Typography>
      </div>
    );
  }

  const projects = data?.pages
    ?.map((page) => page.projects)
    .reduce((prev, next) => prev.concat(next));

  return (
    <>
      {projects && (
        <ProjectListSection
          projects={projects}
          isLoading={isLoading}
          expectedNumberOfProjects={projects.length}
          showNewProcessButton={showNewProcessButton}
        />
      )}
      <div className={styles.footer}>
        {isFetchingNextPage && (
          <Typography variant="body_short">Loading more...</Typography>
        )}
      </div>
    </>
  );
}
