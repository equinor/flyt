import { Typography } from "@equinor/eds-core-react";
import styles from "./NodeTooltipSection.module.scss";

type NodeTooltipSection = {
  header?: string;
  text: string;
};

export const NodeTooltipSection = ({ header, text }: NodeTooltipSection) => (
  <div className={styles.container}>
    <Typography variant="meta" color="Gray">
      {header}
    </Typography>
    <Typography variant="body_long">{text}</Typography>
  </div>
);
