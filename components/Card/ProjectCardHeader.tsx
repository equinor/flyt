import React from "react";
import moment from "moment";
import styles from "./ProjectCardHeader.module.scss";
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
          Modified {moment(props.vsm.lastUpdated).fromNow()}
        </p>
      )}
    </div>
  );
}
