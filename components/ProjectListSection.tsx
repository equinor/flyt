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
}): JSX.Element {
  return (
    <div className={styles.vsmCardContainer}>
      <NewProjectButton />
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
