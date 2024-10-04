import styles from "./ProjectCardHeader.module.scss";
import { Project } from "types/Project";
import { formatDateTimeString } from "@/utils/formatUpdated";

type ProjectCardHeaderProps = {
  project: Project;
};

export const ProjectCardHeader = ({ project }: ProjectCardHeaderProps) => (
  <div className={styles.projectTitleContainer}>
    <h1 className={styles.projectTitle}>
      {project.name || "Untitled process"}
    </h1>
    {!!project.updated && (
      <p className={styles.lastEditedLabel}>
        Modified {formatDateTimeString(project.updated)}
      </p>
    )}
  </div>
);
