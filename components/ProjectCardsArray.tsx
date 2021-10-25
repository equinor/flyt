import { vsmProject } from "../interfaces/VsmProject";
import { ProjectCard } from "./Card/ProjectCard";
import React from "react";

export function ProjectCardsArray(projects: Array<vsmProject>): JSX.Element[] {
  return projects.map((vsm: vsmProject) => (
    <ProjectCard key={vsm.vsmProjectID} vsm={vsm} />
  ));
}
