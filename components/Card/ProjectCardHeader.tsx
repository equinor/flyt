import React from "react";
import styles from "./ProjectCardHeader.module.scss";
import moment from "moment";
import { vsmProject } from "interfaces/VsmProject";

export default function ProjectCardHeader(props: {
  vsm: vsmProject;
}): JSX.Element {
  return (
    <div className={styles.vsmTitleContainer}>
      <h1 className={styles.vsmTitle}>
        {props.vsm.name || "Untitled process"}
      </h1>
      {!!props.vsm.lastUpdated && (
        <p className={styles.lastEditedLabel}>
          Edited {moment(props.vsm.lastUpdated.changeDate).fromNow()}
        </p>
      )}
    </div>
  );
}
