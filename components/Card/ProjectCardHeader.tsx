import styles from "./ProjectCardHeader.module.scss";
import { Project } from "types/Project";
import { formatDateTimeString } from "@/utils/formatUpdated";
import { getProjectName } from "@/utils/getProjectName";

type ProjectCardHeaderProps = {
  project: Project;
};

export const ProjectCardHeader = ({ project }: ProjectCardHeaderProps) => (
  <div className={styles.projectTitleContainer}>
    <h1 className={styles.projectTitle}>{getProjectName(project)}</h1>
    {!!project.updated && (
      <p className={styles.lastEditedLabel}>
        Modified {formatDateTimeString(project.updated)}
      </p>
    )}
  </div>
);
