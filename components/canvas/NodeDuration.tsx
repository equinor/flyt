import { Typography } from "@equinor/eds-core-react";
import styles from "./Node.module.scss";

type NodeDuration = {
  duration: string;
};

export const NodeDuration = ({ duration }: NodeDuration) => (
  <div className={styles["node__time-container"]}>
    <Typography variant="caption" className={styles["node__info-text"]}>
      {duration}
    </Typography>
  </div>
);
