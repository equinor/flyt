import { vsmProject } from "../interfaces/VsmProject";
import { VSMCard } from "./Card/Card";
import React from "react";

export function ProjectCards(props: {
  projects: Array<vsmProject>;
}): JSX.Element {
  return (
    <>
      {props.projects.map((vsm: vsmProject) => (
        <VSMCard key={vsm.vsmProjectID} vsm={vsm} />
      ))}
    </>
  );
}
