import styles from "./ProjectListSection.module.scss";
import { vsmProject } from "../interfaces/VsmProject";
import React from "react";
import { NewProjectButton } from "./NewProjectButton";
import { Typography } from "@equinor/eds-core-react";
import Masonry from "react-masonry-css";
import {
  placeholderProjectCardsArray,
  projectCardsArray,
} from "../utils/getProjectCardsArray";

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
        breakpointCols={{
          default: 4,
          1648: 3,
          1300: 2,
          952: 1,
        }}
        className={styles.grid}
      >
        {props.showNewProjectButton && <NewProjectButton />}
        {isLoading
          ? placeholderProjectCardsArray(expectedNumberOfProjects)
          : projectCardsArray(projects)}
      </Masonry>
    </>
  );
}
