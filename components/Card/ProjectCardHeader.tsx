import styles from "./ProjectCardHeader.module.scss";
import { Project } from "types/Project";
import { formatDateTimeString } from "@/utils/formatUpdated";
import { getFormattedTitle } from "@/utils/getProjectName";

type ProjectCardHeaderProps = {
  project: Project;
};

export const ProjectCardHeader = ({ project }: ProjectCardHeaderProps) => {
  const { titleText, duplicateText } = getFormattedTitle(project);
  return (
    <div className={styles.projectTitleContainer}>
      <h1 className={styles.projectTitle}>{titleText}</h1>
      {duplicateText && <p className={styles.caption}>{duplicateText}</p>}
      {!!project.updated && (
        <p className={styles.lastEditedLabel}>
          Modified {formatDateTimeString(project.updated)}
        </p>
      )}
    </div>
  );
};
