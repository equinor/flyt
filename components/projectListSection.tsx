import styles from "../pages/projects/Projects.module.scss";
import { vsmProject } from "../interfaces/VsmProject";
import { VSMCard } from "./Card/Card";
import commonStyles from "../styles/common.module.scss";
import React from "react";

export function ProjectListSection(props: {
  projects: unknown[];
}): JSX.Element {
  return (
    <div className={styles.vsmCardContainer}>
      {props.projects?.length > 0 ? (
        props.projects.map((vsm: vsmProject) => (
          <VSMCard key={vsm.vsmProjectID} vsm={vsm} />
        ))
      ) : (
        <p className={commonStyles.appear}>Could not find any VSMs</p>
      )}
    </div>
  );
}
