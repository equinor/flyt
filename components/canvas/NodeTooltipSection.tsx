import { Typography } from "@equinor/eds-core-react";
import styles from "./NodeTooltipSection.module.scss";
import { formatNodeText } from "./utils/formatNodeText";

type NodeTooltipSection = {
  header?: string;
  text: string;
};

export const NodeTooltipSection = ({ header, text }: NodeTooltipSection) => (
  <div className={styles.container}>
    <Typography variant="meta" color="Gray">
      {formatNodeText(header)}
    </Typography>
    <Typography variant="body_long">{formatNodeText(text)}</Typography>
  </div>
);
