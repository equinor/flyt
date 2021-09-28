import styles from "../pages/projects/Projects.module.scss";
import { vsmProject } from "../interfaces/VsmProject";
import React from "react";
import { PlaceholderProjectCards } from "./PlaceholderProjectCards";
import { NewProjectButton } from "./NewProjectButton";
import { ProjectCards } from "./ProjectCards";

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
  return (
    <div className={styles.vsmCardContainer}>
      {showNewProjectButton && <NewProjectButton />}
      {isLoading ? (
        <PlaceholderProjectCards numberOfCards={expectedNumberOfProjects} />
      ) : (
        <ProjectCards projects={projects} />
      )}
    </div>
  );
}
