import styles from "../pages/processes/Projects.module.scss";
import { vsmProject } from "../interfaces/VsmProject";
import React from "react";
import { PlaceholderProjectCards } from "./PlaceholderProjectCards";
import { NewProjectButton } from "./NewProjectButton";
import { ProjectCards } from "./ProjectCards";
import { Typography } from "@equinor/eds-core-react";

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

  if (isLoading) {
    return (
      <PlaceholderProjectCards
        numberOfCards={expectedNumberOfProjects}
        showNewProjectButton={showNewProjectButton}
      />
    );
  }

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
    <ProjectCards
      projects={projects}
      showNewProjectButton={showNewProjectButton}
    />
  );
}
