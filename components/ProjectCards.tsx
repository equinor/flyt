import { vsmProject } from "../interfaces/VsmProject";
import { ProjectCard } from "./Card/ProjectCard";
import React from "react";
import Masonry from "react-masonry-css";
import styles from "../pages/processes/Projects.module.scss";
import { NewProjectButton } from "./NewProjectButton";

export function ProjectCards(props: {
  projects: Array<vsmProject>;
  showNewProjectButton: boolean;
}): JSX.Element {
  const { projects, showNewProjectButton } = props;
  const breakpointColumnsObj = {
    default: 4,
    1648: 3,
    1300: 2,
    952: 1,
  };

  const arrayProjectCards = showNewProjectButton
    ? [<NewProjectButton key="new" />].concat(
        projects.map((vsm: vsmProject) => (
          <ProjectCard key={vsm.vsmProjectID} vsm={vsm} />
        ))
      )
    : projects.map((vsm: vsmProject) => (
        <ProjectCard key={vsm.vsmProjectID} vsm={vsm} />
      ));

  return (
    <>
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className={styles.grid}
        columnClassName={styles.gridcolumn}
      >
        {arrayProjectCards}
      </Masonry>
    </>
  );
}
