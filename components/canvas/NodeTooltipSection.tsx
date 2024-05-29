import styles from "./NodeTooltipSection.module.scss";
import { FormatNodeText } from "./utils/FormatNodeText";

type NodeTooltipSection = {
  header?: string;
  text: string;
};

export const NodeTooltipSection = ({ header, text }: NodeTooltipSection) => (
  <div className={styles.container}>
    <FormatNodeText variant="meta" color="Gray">
      {header}
    </FormatNodeText>
    <FormatNodeText variant="body_long">{text}</FormatNodeText>
  </div>
);
