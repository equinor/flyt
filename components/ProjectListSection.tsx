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
  if (props.projects === undefined || props.projects.length === 0) {
    return (
      <div className={styles.vsmEmptyCardContainer}>
        {props.showNewProjectButton && <NewProjectButton />}
        <p>There are no projects to show.</p>
      </div>
    );
  }
  return (
    <div className={styles.vsmCardContainer}>
      {props.showNewProjectButton && <NewProjectButton />}
      {props.isLoading ? (
        <PlaceholderProjectCards
          numberOfCards={props.expectedNumberOfProjects}
        />
      ) : (
        <ProjectCards projects={props.projects} />
      )}
    </div>
  );
}
