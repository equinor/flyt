import moment from "moment";
import styles from "./ProjectCardHeader.module.scss";
import { vsmProject } from "types/VsmProject";

export function ProjectCardHeader(props: { vsm: vsmProject }): JSX.Element {
  return (
    <div className={styles.vsmTitleContainer}>
      <h1 className={styles.vsmTitle}>
        {props.vsm.name || "Untitled process"}
      </h1>
      {!!props.vsm.updated && (
        <p className={styles.lastEditedLabel}>
          Modified {moment(props.vsm.updated).fromNow()}
        </p>
      )}
    </div>
  );
}
