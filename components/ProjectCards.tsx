import { vsmProject } from "../interfaces/VsmProject";
import { VSMCard } from "./Card/Card";
import React from "react";

export function ProjectCards(props: {
  projects: Array<vsmProject>;
}): JSX.Element {
  if (props.projects.length < 1) {
    return <p>There are no projects to show.</p>;
  }
  return (
    <>
      {props.projects.map((vsm: vsmProject) => (
        <VSMCard key={vsm.vsmProjectID} vsm={vsm} />
      ))}
    </>
  );
}
