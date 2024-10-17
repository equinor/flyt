import { InfiniteQueryProjects } from "@/types/InfiniteQueryProjects";
import { Project } from "@/types/Project";
import { unknownErrorToString } from "@/utils/isError";
import { CircularProgress, Typography } from "@equinor/eds-core-react";
import { useMemo } from "react";
import styles from "./ProjectList.module.scss";
import { ProjectListSection } from "./ProjectListSection";

type ProjectListProps = {
  showNewProcessButton?: boolean;
  query: InfiniteQueryProjects;
  readOnly?: boolean;
  onCardClick?: (vsm: Project) => void;
  selectedCard?: Project;
};

export const ProjectList = ({
  showNewProcessButton,
  query,
  readOnly,
  onCardClick,
  selectedCard,
}: ProjectListProps) => {
  const { data, isLoading, error, isFetchingNextPage } = query;

  if (error) {
    return (
      <div>
        <Typography variant={"h2"}>{`Couldn't fetch projects`}</Typography>
        <Typography variant={"h3"}>{unknownErrorToString(error)}</Typography>
      </div>
    );
  }

  const projects = useMemo(
    () => data?.pages?.flatMap((page) => page.projects),
    [data]
  );

  return (
    <>
      {projects && (
        <ProjectListSection
          projects={projects}
          isLoading={isLoading}
          expectedNumberOfProjects={projects.length}
          showNewProcessButton={showNewProcessButton}
          readOnly={readOnly}
          onCardClick={onCardClick}
          selectedCard={selectedCard}
        />
      )}
      {(isLoading || isFetchingNextPage) && (
        <div className={styles.footer}>
          <CircularProgress />
        </div>
      )}
    </>
  );
};
