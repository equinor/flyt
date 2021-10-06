import { vsmProject } from "../interfaces/VsmProject";
import { ProjectCard } from "./Card/ProjectCard";
import React from "react";

export function ProjectCards(props: {
  projects: Array<vsmProject>;
}): JSX.Element {
  if (props.projects.length < 1) {
    return <p>There are no processes to show.</p>;
  }
  return (
    <>
      {props.projects.map((vsm: vsmProject) => (
        <ProjectCard key={vsm.vsmProjectID} vsm={vsm} />
      ))}
    </>
  );
}
