import moment from "moment";
import styles from "./ProjectCardHeader.module.scss";
import { Project } from "types/Project";

type ProjectCardHeaderProps = {
  vsm: Project;
};

export const ProjectCardHeader = ({ vsm }: ProjectCardHeaderProps) => (
  <div className={styles.vsmTitleContainer}>
    <h1 className={styles.vsmTitle}>{vsm.name || "Untitled process"}</h1>
    {!!vsm.updated && (
      <p className={styles.lastEditedLabel}>
        Modified {moment(vsm.updated).fromNow()}
      </p>
    )}
  </div>
);
