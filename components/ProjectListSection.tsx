import styles from "../pages/processes/Projects.module.scss";
import { vsmProject } from "../interfaces/VsmProject";
import React from "react";
import { PlaceholderProjectCardsArray } from "./PlaceholderProjectCardsArray";
import { NewProjectButton } from "./NewProjectButton";
import { ProjectCardsArray } from "./ProjectCardsArray";
import { Typography } from "@equinor/eds-core-react";
import Masonry from "react-masonry-css";

export function ProjectListSection(props: {
  projects: Array<vsmProject>;
  isLoading: boolean;
  expectedNumberOfProjects: number;
  showNewProjectButton: boolean;
}): JSX.Element {
  const {
    isLoading,
    projects,
    showNewProjectButton,
    expectedNumberOfProjects,
  } = props;

  const breakpointColumnsObj = {
    default: 4,
    1648: 3,
    1300: 2,
    952: 1,
  };

  if (projects?.length < 1) {
    return (
      <div className={styles.emptyVsmCardContainer}>
        <Typography variant="h4" style={{ marginBottom: "30px" }}>
          There are no projects to show.
        </Typography>
        {showNewProjectButton && <NewProjectButton />}
      </div>
    );
  }

  return (
    <>
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className={styles.grid}
        columnClassName={styles.gridcolumn}
      >
        {props.showNewProjectButton && <NewProjectButton />}
        {isLoading
          ? PlaceholderProjectCardsArray(expectedNumberOfProjects)
          : ProjectCardsArray(projects)}
      </Masonry>
    </>
  );
}
